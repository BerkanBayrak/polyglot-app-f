import { useState, useEffect } from 'react';
import ApiService from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export const useContent = () => {
  const { sourceLang, targetLang } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchContent = async (type, level = 1, limit = 10) => {
    if (!sourceLang || !targetLang) {
      throw new Error('Language settings are required');
    }

    setLoading(true);
    setError(null);

    try {
      let response;

      switch (type) {
        case 'vocabulary':
          response = await ApiService.getVocabulary(sourceLang, targetLang, level, limit);
          break;
        case 'grammar':
          response = await ApiService.getGrammar(sourceLang, targetLang, level, limit);
          break;
        case 'sentences':
          response = await ApiService.getSentences(sourceLang, targetLang, level, limit);
          break;
        case 'fillBlanks':
          response = await ApiService.getFillBlanks(sourceLang, targetLang, level, limit);
          break;
        case 'imageBased':
          response = await ApiService.getImageBased(sourceLang, targetLang, level, limit);
          break;
        default:
          throw new Error(`Unknown content type: ${type}`);
      }

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch content');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchContent,
    loading,
    error,
    clearError: () => setError(null)
  };
};

// Specific hooks for each content type
export const useVocabulary = (level = 1, limit = 10) => {
  const [vocabulary, setVocabulary] = useState([]);
  const { fetchContent, loading, error } = useContent();
  const { sourceLang, targetLang } = useLanguage();

  const loadVocabulary = async () => {
    try {
      const data = await fetchContent('vocabulary', level, limit);
      setVocabulary(data);
      return data;
    } catch (err) {
      console.error('Error loading vocabulary:', err);
      return [];
    }
  };

  useEffect(() => {
    if (sourceLang && targetLang) {
      loadVocabulary();
    }
  }, [sourceLang, targetLang, level, limit]);

  return {
    vocabulary,
    loading,
    error,
    reload: loadVocabulary
  };
};

export const useGrammar = (level = 1, limit = 10) => {
  const [grammar, setGrammar] = useState([]);
  const { fetchContent, loading, error } = useContent();
  const { sourceLang, targetLang } = useLanguage();

  const loadGrammar = async () => {
    try {
      const data = await fetchContent('grammar', level, limit);
      setGrammar(data);
      return data;
    } catch (err) {
      console.error('Error loading grammar:', err);
      return [];
    }
  };

  useEffect(() => {
    if (sourceLang && targetLang) {
      loadGrammar();
    }
  }, [sourceLang, targetLang, level, limit]);

  return {
    grammar,
    loading,
    error,
    reload: loadGrammar
  };
};

export const useSentences = (level = 1, limit = 10) => {
  const [sentences, setSentences] = useState([]);
  const { fetchContent, loading, error } = useContent();
  const { sourceLang, targetLang } = useLanguage();

  const loadSentences = async () => {
    try {
      const data = await fetchContent('sentences', level, limit);
      setSentences(data);
      return data;
    } catch (err) {
      console.error('Error loading sentences:', err);
      return [];
    }
  };

  useEffect(() => {
    if (sourceLang && targetLang) {
      loadSentences();
    }
  }, [sourceLang, targetLang, level, limit]);

  return {
    sentences,
    loading,
    error,
    reload: loadSentences
  };
};

export const useFillBlanks = (level = 1, limit = 10) => {
  const [fillBlanks, setFillBlanks] = useState([]);
  const { fetchContent, loading, error } = useContent();
  const { sourceLang, targetLang } = useLanguage();

  const loadFillBlanks = async () => {
    try {
      const data = await fetchContent('fillBlanks', level, limit);
      setFillBlanks(data);
      return data;
    } catch (err) {
      console.error('Error loading fill blanks:', err);
      return [];
    }
  };

  useEffect(() => {
    if (sourceLang && targetLang) {
      loadFillBlanks();
    }
  }, [sourceLang, targetLang, level, limit]);

  return {
    fillBlanks,
    loading,
    error,
    reload: loadFillBlanks
  };
};

export const useImageBased = (level = 1, limit = 10) => {
  const [imageBased, setImageBased] = useState([]);
  const { fetchContent, loading, error } = useContent();
  const { sourceLang, targetLang } = useLanguage();

  const loadImageBased = async () => {
    try {
      const data = await fetchContent('imageBased', level, limit);
      setImageBased(data);
      return data;
    } catch (err) {
      console.error('Error loading image based:', err);
      return [];
    }
  };

  useEffect(() => {
    if (sourceLang && targetLang) {
      loadImageBased();
    }
  }, [sourceLang, targetLang, level, limit]);

  return {
    imageBased,
    loading,
    error,
    reload: loadImageBased
  };
};