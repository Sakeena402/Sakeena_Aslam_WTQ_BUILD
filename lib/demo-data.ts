/**
 * Demo data for the Bill Decoder UI
 * Demonstrates the complete Level 1 schema with real-looking electricity bill data
 */

import type { ExtractedBill, ProcessedBill } from './types'

export const DEMO_BILL_KE: ExtractedBill = {
  provider: 'KE',
  tariff: 'Residential',
  sanctioned_load_kw: 3.6,
  bill_month: 'October 2024',
  reading_date: '2024-10-28',
  issue_date: '2024-10-30',
  due_date: '2024-11-15',
  previous_reading: 45200,
  current_reading: 45850,
  units_consumed: 650,
  charges: [
    { type: 'energy', amount: 6890 },
    { type: 'fixed', amount: 450 },
    { type: 'meter_rent', amount: 100 },
    { type: 'fpa', amount: 345 },
  ],
  total_charges: 7785,
  taxes: [
    { type: 'gst', amount: 1557 },
    { type: 'electricity_duty', amount: 980 },
  ],
  total_taxes: 2537,
  current_bill: 10322,
  arrears: 0,
  payable_within_due_date: 10322,
  payable_after_due_date: 10641,
}

export const DEMO_BILL_LESCO: ExtractedBill = {
  provider: 'LESCO',
  tariff: 'General Service',
  sanctioned_load_kw: 5.0,
  bill_month: 'September 2024',
  reading_date: '2024-09-25',
  issue_date: '2024-09-27',
  due_date: '2024-10-12',
  previous_reading: 12340,
  current_reading: 12950,
  units_consumed: 610,
  charges: [
    { type: 'energy', amount: 7320 },
    { type: 'fixed', amount: 500 },
    { type: 'quarterly_adjustment', amount: 245 },
    { type: 'surcharge', amount: 610 },
  ],
  total_charges: 8675,
  taxes: [
    { type: 'gst', amount: 1735 },
    { type: 'municipal_tax', amount: 434 },
  ],
  total_taxes: 2169,
  current_bill: 10844,
  arrears: 0,
  payable_within_due_date: 10844,
  payable_after_due_date: 11370,
}

export const DEMO_BILL_IESCO: ExtractedBill = {
  provider: 'IESCO',
  tariff: 'Domestic',
  sanctioned_load_kw: 3.0,
  bill_month: 'November 2024',
  reading_date: '2024-11-05',
  issue_date: '2024-11-07',
  due_date: '2024-11-22',
  previous_reading: 28500,
  current_reading: 29180,
  units_consumed: 680,
  charges: [
    { type: 'energy', amount: 5440 },
    { type: 'fixed', amount: 400 },
    { type: 'fpa', amount: 272 },
  ],
  total_charges: 6112,
  taxes: [
    { type: 'electricity_duty', amount: 734 },
    { type: 'gst', amount: 1222 },
  ],
  total_taxes: 1956,
  current_bill: 8068,
  arrears: 500,
  payable_within_due_date: 8568,
  payable_after_due_date: 8842,
}

export const DEMO_PROCESSED_BILL: ProcessedBill = {
  id: 'bill-001',
  fileName: 'ke-bill-oct-2024.jpg',
  provider: 'KE',
  extractedData: DEMO_BILL_KE,
  uploadedAt: new Date().toISOString(),
  lastModified: new Date().toISOString(),
}

export const DEMO_BILLS: ProcessedBill[] = [
  DEMO_PROCESSED_BILL,
  {
    id: 'bill-002',
    fileName: 'lesco-bill-sep-2024.pdf',
    provider: 'LESCO',
    extractedData: DEMO_BILL_LESCO,
    uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastModified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'bill-003',
    fileName: 'iesco-bill-nov-2024.jpg',
    provider: 'IESCO',
    extractedData: DEMO_BILL_IESCO,
    uploadedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    lastModified: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
]
