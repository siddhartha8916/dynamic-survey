export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getQuestionTypeLabel = (type: string): string => {
  switch (type) {
    case 'text':
      return 'Text Question';
    case 'number':
      return 'Number Input';
    case 'single':
      return 'Single Select';
    case 'multi':
      return 'Multiple Choice';
    default:
      return type;
  }
};

export const getSurveyIcon = (title: string): string => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('employee')) return 'domain';
  if (lowerTitle.includes('product')) return 'inventory';
  if (lowerTitle.includes('market')) return 'bar_chart';
  return 'record_voice_over';
};

export const getStatusColor = (status: string): 'success' | 'warning' | 'default' => {
  switch (status) {
    case 'active':
      return 'success';
    case 'draft':
      return 'warning';
    default:
      return 'default';
  }
};