export type DisruptionEventType = 'WEATHER_RISK' | 'ACTIVITY_CANCELLED' | 'TRANSPORT_DELAY' | 'HOTEL_ISSUE';
export type CascadeSeverity = 'DIRECT' | 'DOWNSTREAM' | 'RESOURCE' | 'FINANCIAL';
export type ApprovalRole = 'TRAVELER' | 'OPERATOR' | 'BOTH';

export interface CascadeItem {
  id: string;
  type: 'ACTIVITY' | 'TRANSPORT' | 'GUIDE' | 'RESTAURANT' | 'FINANCIAL';
  name: string;
  vendor: string;
  impactDescription: string;
  severity: CascadeSeverity;
  actionRequired: string;
}

export interface TradeoffSummary {
  pros: string[];
  cons: string[];
  operationalFeasibility: string;
  weatherProofRating: string;
}

export interface AlternativeProposal {
  id: string;
  title: string;
  category: string;
  vendorName: string;
  description: string;
  timeSlot: string;
  costDelta: number; // e.g. +600 or -800
  refundFromCancelled: number; // e.g. 2400
  newActivityCost: number; // e.g. 3000
  preferenceMatchScore: number; // e.g. 95
  travelDeltaMinutes: number; // e.g. +10
  scheduleImpact: string;
  weatherRisk: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
  approvalRequired: ApprovalRole;
  isRecommended?: boolean;
  tradeoffs: TradeoffSummary;
}

export interface DisruptionEvent {
  id: string;
  eventType: DisruptionEventType;
  affectedItemId: string;
  affectedItemTitle: string;
  dayNumber: number;
  triggerSource: string; // e.g. "Goa Maritime & Weather Bureau API"
  reason: string;
  status: 'ACTIVE' | 'RESOLVED' | 'DISMISSED';
  detectedAt: string;
  cascadeItems: CascadeItem[];
  proposals: AlternativeProposal[];
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  recipientRole: 'TRAVELER' | 'OPERATOR' | 'VENDOR' | 'ALL';
  stakeholderName?: string;
  title: string;
  message: string;
  type: 'ALERT' | 'INFO' | 'SUCCESS' | 'DISRUPTION';
  read: boolean;
}
