/**
 * @file itinerary.service.ts
 * @module frontend/src/services
 * @description Consumer service wrapping apiService calls for itinerary domain features.
 */

import { apiService } from './api.service';
import { TravelerPreferences } from '../types/profile.types';

export const itineraryService = {
  extractPreferences: (prompt: string) => apiService.extractPreferences(prompt),
  checkFeasibility: (preferences: TravelerPreferences) => apiService.checkFeasibility(preferences),
  getOptions: (preferences?: TravelerPreferences) => apiService.getItineraryOptions(preferences),
  getItinerary: (id?: string) => apiService.getItineraryById(id),
  getDisruption: (itineraryId: string) => apiService.getDisruptionEvent(itineraryId),
  simulateDisruption: (itineraryId: string) => apiService.simulateDisruption(itineraryId),
  acceptProposal: (itinerary: any, proposalId: string) => apiService.applyAlternativeProposal(itinerary, proposalId),
  getNotifications: () => apiService.getNotifications(),
  resetItinerary: () => apiService.resetItinerary(),
};
