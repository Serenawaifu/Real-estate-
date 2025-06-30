import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Advanced Form Validation Hook with comprehensive features
 */
const useFormValidation = (initialValues = {}, validationSchema = {}, options = {}) => {
  const {
    // Validation options
    validateOnMount = false,
    validateOnChange = true,
    validateOnBlur = true,
    validateOnSubmit = true,
    revalidateOnChange = true,
    abortEarly = false,
    
    // Debounce/Throttle
    debounceDelay = 300,
    throttleDelay = 0,
    
    // Advanced options
    asyncValidation = false,
    crossFieldValidation = true,
    dynamicValidation = false,
    cascadeValidation = true,
    
    // Callbacks
    onValidationStart,
    onValidationEnd,
    onValidationError,
    onSubmit,
    onSubmitSuccess,
    onSubmitError,
    
    // Transform options
    transformBeforeValidation = null,
    transformAfterValidation = null,
    sanitizeValues = true,
    
    // Debug
    debug = false,
  } = options;

  // State management
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const [fieldMeta, setFieldMeta] = useState({});

  // Refs
  const validationCache = useRef(new Map());
  const debounceTimers = useRef({});
  const throttleTimers = useRef({});
  const asyncValidationAbort = useRef({});
  const lastValidatedValues = useRef({});
  const validationQueue = useRef([]);
  const isFirstRender = useRef(true);

  // Validation status for each field
  const [validationStatus, setValidationStatus] = useState({});

  // Helper functions
  const debounce = useCallback((func, delay, key) => {
    return (...args) => {
      clearTimeout(debounceTimers.current[key]);
      debounceTimers.current[key] = setTimeout(() => func(...args), delay);
    };
  }, []);

  const throttle = useCallback((func, delay, key) => {
    return (...args) => {
      if (!throttleTimers.current[key]) {
        throttleTimers.current[key] = setTimeout(() => {
          func(...args);
          throttleTimers.current[key] = null;
        }, delay);
      }
    };
  }, []);

  // Built-in validators
  const validators = {
    required: (value, message = 'This field is required') => {
      if (Array.isArray(value)) return value.length > 0 || message;
      if (typeof value === 'string') return value.trim().length > 0 || message;
      return value !== null && value !== undefined || message;
    },

    email: (value, message = 'Invalid email address') => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return !value || emailRegex.test(value) || message;
    },

    url: (value, message = 'Invalid URL') => {
      try {
        if (!value) return true;
        new URL(value);
        return true;
      } catch {
        return message;
      }
    },

    min: (min, message) => (value) => {
      const errorMessage = message || `Must be at least ${min}`;
      if (typeof value === 'string') return value.length >= min || errorMessage;
      if (typeof value === 'number') return value >= min || errorMessage;
      if (Array.isArray(value)) return value.length >= min || errorMessage;
      return true;
    },

    max: (max, message) => (value) => {
      const errorMessage = message || `Must be at most ${max}`;
      if (typeof value === 'string') return value.length <= max || errorMessage;
      if (typeof value === 'number') return value <= max || errorMessage;
      if (Array.isArray(value)) return value.length <= max || errorMessage;
      return true;
    },

    pattern: (regex, message = 'Invalid format') => (value) => {
      return !value || regex.test(value) || message;
    },

    custom: (validator, message) => (value, values) => {
      return validator(value, values) || message;
    },

    matches: (field, message) => (value, values) => {
      const errorMessage = message || `Must match ${field}`;
      return value === values[field] || errorMessage;
    },

    unique: (list, message = 'This value already exists') => (value) => {
      return !list.includes(value) || message;
    },

    phone: (message = 'Invalid phone number') => (value) => {
      const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{4,6}$/;
      return !value || phoneRegex.test(value.replace(/\s/g, '')) || message;
    },

    numeric: (message = 'Must be a number') => (value) => {
      return !value || !isNaN(value) || message;
    },

    alphanumeric: (message = 'Must contain only letters and numbers') => (value) => {
      const alphanumericRegex = /^[a-zA-Z0-9]+$/;
      return !value || alphanumericRegex.test(value) || message;
    },

    date: (message = 'Invalid date') => (value) => {
      if (!value) return true;
      const date = new Date(value);
      return !isNaN(date.getTime()) || message;
    },

    creditCard: (message = 'Invalid credit card number') => (value) => {
      if (!value) return true;
      // Luhn algorithm
      const sanitized = value.replace(/\s/g, '');
      if (!/^\d+$/.test(sanitized)) return message;
      
      let sum = 0;
      let isEven = false;
      
      for (let i = sanitized.length - 1; i >= 0; i--) {
        let digit = parseInt(sanitized[i]);
        if (isEven) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        sum += digit;
        isEven = !isEven;
      }
      
      return sum % 10 === 0 || message;
    }
  };

  // Sanitize value based on type
  const sanitizeValue = useCallback((value, type) => {
    if (!sanitizeValues) return value;

    switch (type) {
      case 'email':
        return value?.toLowerCase().trim();
      case 'url':
        return value?.trim();
      case 'phone':
        return value?.replace(/[^\d+\-\s()]/g, '');
      case 'numeric':
        return value?.replace(/[^\d.-]/g, '');
      case 'alphanumeric':
        return value?.replace(/[^a-zA-Z0-9]/g, '');
      default:
        return typeof value === 'string' ? value.trim() : value;
    }
  }, [sanitizeValues]);

  // Validate single field
  const validateField = useCallback(async (name, value, allValues = values) => {
    const fieldValidation = validationSchema[name];
    if (!fieldValidation) return null;

    // Check cache
    const cacheKey = `${name}:${JSON.stringify(value)}`;
    if (validationCache.current.has(cacheKey) && !asyncValidation) {
      return validationCache.current.get(cacheKey);
    }

    // Transform value before validation
    const transformedValue = transformBeforeValidation 
      ? transformBeforeValidation(value, name, allValues)
      : value;

    let error = null;

    try {
      // Array of validators
      if (Array.isArray(fieldValidation)) {
        for (const validator of fieldValidation) {
          const result = typeof validator === 'function' 
            ? await validator(transformedValue, allValues)
            : validator;
          
          if (result !== true) {
            error = result;
            if (abortEarly) break;
          }
        }
      }
      // Single validator function
      else if (typeof fieldValidation === 'function') {
        const result = await fieldValidation(transformedValue, allValues);
        if (result !== true) {
          error = result;
        }
      }
      // Validation config object
      else if (typeof fieldValidation === 'object') {
        const { validate, async, depends, message } = fieldValidation;
        
        // Check dependencies
        if (depends && !depends(allValues)) {
          return null;
        }

        // Async validation
        if (async && asyncValidation) {
          // Cancel previous async validation
          if (asyncValidationAbort.current[name]) {
            asyncValidationAbort.current[name].abort();
          }

          const abortController = new AbortController();
          asyncValidationAbort.current[name] = abortController;

          try {
            const result = await validate(transformedValue, allValues, abortController.signal);
            if (result !== true) {
              error = message || result;
            }
          } catch (err) {
            if (err.name !== 'AbortError') {
              error = message || 'Validation failed';
            }
          }
        } else if (validate) {
          const result = await validate(transformedValue, allValues);
          if (result !== true) {
            error = message || result;
          }
        }
      }

      // Cache result
      if (!asyncValidation) {
        validationCache.current.set(cacheKey, error);
      }

      // Transform after validation
      if (transformAfterValidation && error) {
        error = transformAfterValidation(error, name, allValues);
      }

      return error;

    } catch (err) {
      if (debug) {
        console.error(`Validation error for field ${name}:`, err);
      }
      return 'Validation error';
    }
  }, [
    validationSchema,
    values,
    abortEarly,
    asyncValidation,
    transformBeforeValidation,
    transformAfterValidation,
    debug
  ]);

  // Validate all fields
  const validateAllFields = useCallback(async (valuesToValidate = values) => {
    if (onValidationStart) onValidationStart();
    setIsValidating(true);

    const newErrors = {};
    const validationPromises = [];

    // Validate each field
    for (const fieldName of Object.keys(validationSchema)) {
      if (cascadeValidation) {
        // Sequential validation
        const error = await validateField(fieldName, valuesToValidate[fieldName], valuesToValidate);
        if (error) {
          newErrors[fieldName] = error;
          if (abortEarly) break;
        }
      } else {
        // Parallel validation
        validationPromises.push(
          validateField(fieldName, valuesToValidate[fieldName], valuesToValidate)
            .then(error => {
              if (error) newErrors[fieldName] = error;
            })
        );
      }
    }

    if (!cascadeValidation) {
      await Promise.all(validationPromises);
    }

    // Cross-field validation
    if (crossFieldValidation && validationSchema._cross) {
      try {
        const crossErrors = await validationSchema._cross(valuesToValidate);
        if (crossErrors) {
          Object.assign(newErrors, crossErrors);
        }
      } catch (err) {
        if (debug) {
          console.error('Cross-field validation error:', err);
        }
      }
    }

    setErrors(newErrors);
    setIsValidating(false);
    lastValidatedValues.current = valuesToValidate;

    if (onValidationEnd) onValidationEnd(newErrors);
    if (Object.keys(newErrors).length > 0 && onValidationError) {
      onValidationError(newErrors);
    }

    return newErrors;
  }, [
    values,
    validationSchema,
    validateField,
    cascadeValidation,
    abortEarly,
    crossFieldValidation,
    onValidationStart,
    onValidationEnd,
    onValidationError,
    debug
  ]);

  // Handle field change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target || e;
    const fieldValue = type === 'checkbox' ? checked : 
                      type === 'file' ? files : 
                      value;

    // Sanitize value
    const sanitizedValue = sanitizeValue(fieldValue, fieldMeta[name]?.type);

    // Update values
    setValues(prev => ({ ...prev, [name]: sanitizedValue }));

    // Update field meta
    setFieldMeta(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        pristine: false,
        dirty: true,
        touchedCount: (prev[name]?.touchedCount || 0) + 1
      }
    }));

    // Validate on change
    if (validateOnChange || (revalidateOnChange && touched[name])) {
      const validate = throttleDelay > 0 
        ? throttle(validateField, throttleDelay, name)
        : debounceDelay > 0
        ? debounce(validateField, debounceDelay, name)
        : validateField;

      validate(name, sanitizedValue, { ...values, [name]: sanitizedValue })
        .then(error => {
          setErrors(prev => ({
            ...prev,
            [name]: error
          }));
        });
    }
  }, [
    values,
    touched,
    fieldMeta,
    validateOnChange,
    revalidateOnChange,
    validateField,
    sanitizeValue,
    debounceDelay,
    throttleDelay,
    debounce,
    throttle
  ]);

  // Handle field blur
  const handleBlur = useCallback((e) => {
    const { name } = e.target || e;
    
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Update field meta
    setFieldMeta(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        touched: true,
        blurredCount: (prev[name]?.blurredCount || 0) + 1
      }
    }));

    if (validateOnBlur) {
      validateField(name, values[name], values)
        .then(error => {
          setErrors(prev => ({
            ...prev,
            [name]: error
          }));
        });
    }
  }, [values, validateOnBlur, validateField]);

  // Handle form submission
  const handleSubmit = useCallback((e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    setIsSubmitting(true);
    setSubmitCount(prev => prev + 1);

    // Touch all fields
    const allTouched = {};
    Object.keys(validationSchema).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validate all fields
    const submitValidation = async () => {
      try {
        if (validateOnSubmit) {
          const validationErrors = await validateAllFields();
          
          if (Object.keys(validationErrors).length > 0) {
            setIsSubmitting(false);
            if (onSubmitError) {
              onSubmitError(validationErrors);
            }
            return;
          }
        }

        // Call onSubmit callback
        if (onSubmit) {
          await onSubmit(values, {
            setErrors,
            setValues,
            setFieldValue,
            resetForm,
            validateField,
            validateAllFields
          });
          
          if (onSubmitSuccess) {
            onSubmitSuccess(values);
          }
        }
      } catch (error) {
        if (debug) {
          console.error('Submit error:', error);
        }
        if (onSubmitError) {
          onSubmitError(error);
        }
      } finally {
        setIsSubmitting(false);
      }
    };

    submitValidation();
  }, [
    values,
    validationSchema,
    validateOnSubmit,
    validateAllFields,
    onSubmit,
    onSubmitSuccess,
    onSubmitError,
    debug
  ]);

  // Set field value
  const setFieldValue = useCallback((name, value, shouldValidate = true) => {
    const sanitizedValue = sanitizeValue(value, fieldMeta[name]?.type);
    
    setValues(prev => ({ ...prev, [name]: sanitizedValue }));
    
    if (shouldValidate && (validateOnChange || touched[name])) {
      validateField(name, sanitizedValue, { ...values, [name]: sanitizedValue })
        .then(error => {
          setErrors(prev => ({
            ...prev,
            [name]: error
          }));
        });
    }
  }, [values, touched, fieldMeta, validateOnChange, validateField, sanitizeValue]);

  // Set field error
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  // Set field touched
  const setFieldTouched = useCallback((name, touched = true) => {
    setTouched(prev => ({ ...prev, [name]: touched }));
  }, []);

  // Reset form
  const resetForm = useCallback((nextState = {}) => {
    setValues(nextState.values || initialValues);
    setErrors(nextState.errors || {});
    setTouched(nextState.touched || {});
    setSubmitCount(0);
    setFieldMeta({});
    validationCache.current.clear();
    lastValidatedValues.current = {};
  }, [initialValues]);

  // Register field
  const registerField = useCallback((name, config = {}) => {
    setFieldMeta(prev => ({
      ...prev,
      [name]: {
        type: config.type,
        pristine: true,
        dirty: false,
        touched: false,
        touchedCount: 0,
        blurredCount: 0,
        ...config
      }
    }));

    return {
      name,
      value: values[name] || '',
      onChange: handleChange,
      onBlur: handleBlur,
      error: errors[name],
      touched: touched[name],
      ...config.props
    };
  }, [values, errors, touched, handleChange, handleBlur]);

  // Validate on mount
  useEffect(() => {
    if (validateOnMount && isFirstRender.current) {
      validateAllFields();
    }
    isFirstRender.current = false;
  }, [validateOnMount, validateAllFields]);

  // Computed values
  const isValid = Object.keys(errors).length === 0;
  const isDirty = Object.keys(fieldMeta).some(key => fieldMeta[key]?.dirty);
  const isTouched = Object.keys(touched).some(key => touched[key]);
  const isPristine = !isDirty;

  return {
    // Form state
    values,
    errors,
    touched,
    isValid,
    isDirty,
    isPristine,
    isTouched,
    isValidating,
    isSubmitting,
    submitCount,

    // Field meta
    fieldMeta,
    validationStatus,

    // Methods
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    setValues,
    setErrors,
    setTouched,
    validateField,
    validateAllFields,
    resetForm,
    registerField,

    // Utilities
    validators,
    getFieldProps: registerField,
    getFormProps: () => ({
      onSubmit: handleSubmit,
      noValidate: true
    })
  };
};

export default useFormValidation;
