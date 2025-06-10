import { analyzeCv } from '../../services/cvAnalysisService'; // Adjust path as necessary

describe('cvAnalysisService', () => {
  describe('analyzeCv', () => {
    it('should return an object with stars and tips', async () => {
      const mockCvUri = 'file:///mock-cv.pdf';
      const result = await analyzeCv(mockCvUri);

      // Check for the presence and types of the expected properties
      expect(result).toBeDefined();
      expect(result).toHaveProperty('stars');
      expect(typeof result.stars).toBe('number');
      expect(result).toHaveProperty('tips');
      expect(Array.isArray(result.tips)).toBe(true);

      // Check if stars are within a plausible range (e.g., 1-5, though it's random)
      expect(result.stars).toBeGreaterThanOrEqual(1);
      expect(result.stars).toBeLessThanOrEqual(5);

      // Check if tips array contains strings (if not empty)
      if (result.tips.length > 0) {
        result.tips.forEach(tip => {
          expect(typeof tip).toBe('string');
        });
      }
    });

    it('should eventually resolve and not hang', async () => {
      const mockCvUri = 'file:///another-mock-cv.pdf';
      // This test primarily checks that the Promise resolves.
      // The timeout for Jest might need to be configured if the service takes too long.
      // Default Jest timeout is 5 seconds. The service has a 2-second delay.
      await expect(analyzeCv(mockCvUri)).resolves.toBeDefined();
    });
  });
});
