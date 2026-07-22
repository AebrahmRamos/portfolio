/**
 * Utility helper functions for the portfolio
 */

/**
 * Smooth scroll to a section with offset for fixed header
 * @param {string} sectionId - The ID of the section to scroll to
 * @param {number} offset - Offset in pixels (default: 64px for header height)
 */
export const scrollToSection = (sectionId, offset = 64) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
};

/**
 * Format date string to readable format
 * @param {string} dateString - Date string to format
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default {
  scrollToSection,
  formatDate,
};
