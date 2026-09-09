/**
 * @file Destination.model.ts
 * @module backend/models
 * @description Specification for Geographic Destination Entity.
 * 
 * SCHEMA FIELDS & PARAMETERS:
 * - id: UUID (Primary Key)
 * - name: string (e.g. 'Goa', 'North Goa', 'South Goa')
 * - state: string
 * - country: string
 * - coordinates: Point (Lat, Lng)
 * - popular_interests: JSON Array
 * - climate_info: JSON Object (monsoon months, ideal visit times)
 * - created_at: Timestamp
 */
