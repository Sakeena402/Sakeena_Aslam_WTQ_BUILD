/**
 * WTQ Build Track Utility Bill Decoder - Shared Types
 * Level 1 JSON Schema for electricity bill extraction
 *
 * Provider values: KE (K-Electric), LESCO, IESCO
 * Charge types: energy, fixed, fpa, quarterly_adjustment, surcharge, meter_rent, subsidy, other
 * Tax types: gst, electricity_duty, income_tax, municipal_tax, other_tax
 */

export type Provider = 'KE' | 'LESCO' | 'IESCO'

export type ChargeType =
  | 'energy'
  | 'fixed'
  | 'fpa'
  | 'quarterly_adjustment'
  | 'surcharge'
  | 'meter_rent'
  | 'subsidy'
  | 'other'

export type TaxType = 'gst' | 'electricity_duty' | 'income_tax' | 'municipal_tax' | 'other_tax'

export interface Charge {
  type: ChargeType
  amount: number | null
}

export interface Tax {
  type: TaxType
  amount: number | null
}

export interface ExtractedBill {
  provider: Provider | null
  tariff: string | null
  sanctioned_load_kw: number | null
  bill_month: string | null
  reading_date: string | null
  issue_date: string | null
  due_date: string | null
  previous_reading: number | null
  current_reading: number | null
  units_consumed: number | null
  charges: Charge[]
  total_charges: number | null
  taxes: Tax[]
  total_taxes: number | null
  current_bill: number | null
  arrears: number | null
  payable_within_due_date: number | null
  payable_after_due_date: number | null
}

export interface ProcessedBill {
  id: string
  fileName: string
  provider: Provider | null
  extractedData: ExtractedBill
  uploadedAt: string
  lastModified: string
}

export interface BillQuestion {
  id: string
  billId: string
  question: string
  askedAt: string
}

export interface BillAnswer {
  id: string
  questionId: string
  answer: string
  respondedAt: string
}

export interface CompetitionBatch {
  id: string
  name: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: string
  completedAt: string | null
  totalBills: number
  processedBills: number
  failedBills: number
}

export interface AppSettings {
  apiEndpoint: string | null
  apiKeyConfigured: boolean
  lastSyncAt: string | null
}
