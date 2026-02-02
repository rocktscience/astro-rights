// Royalty calculation and distribution utilities

import type { Work, Writer, RoyaltyLineItem, WriterDistribution, RoyaltyStatement } from '@/types';
import { parseCSV } from '@/lib/csv-import';

export interface DistributionResult {
  lineItemId: string;
  workId: string;
  workTitle: string;
  totalGross: number;
  distributions: WriterDistribution[];
  publisherShare: number;
  errors: string[];
}

export interface DistributionReport {
  statementId: string;
  source: string;
  period: string;
  generatedAt: Date;
  totalGross: number;
  totalFees: number;
  totalNet: number;
  byWriter: Map<string, {
    writer: Writer;
    grossAmount: number;
    feeAmount: number;
    netAmount: number;
    works: Array<{
      workTitle: string;
      grossAmount: number;
      feeAmount: number;
      netAmount: number;
    }>;
  }>;
  publisherTotal: {
    grossAmount: number;
    feeIncome: number;
    ownedShare: number;
    totalIncome: number;
  };
}

// Calculate writer distributions for a single royalty line item
export const calculateDistribution = (
  lineItem: RoyaltyLineItem,
  work: Work,
  defaultPublisherFee: number = 25
): DistributionResult => {
  const errors: string[] = [];
  const distributions: WriterDistribution[] = [];
  let publisherShare = 0;
  
  // Get controlled writers
  const writerShares = work.writerShares || [];
  const controlledWriterShares = writerShares.filter(
    ws => ws.writer?.isControlled
  );
  
  if (controlledWriterShares.length === 0) {
    errors.push('No controlled writers found for this work');
    return {
      lineItemId: lineItem.id,
      workId: work.id,
      workTitle: work.title,
      totalGross: lineItem.grossAmount,
      distributions,
      publisherShare: 0,
      errors,
    };
  }
  
  // Calculate total controlled share
  const totalControlledShare = controlledWriterShares.reduce((sum, ws) => {
    switch (lineItem.rightType) {
      case 'PR': return sum + ws.prOwnership;
      case 'MR': return sum + ws.mrOwnership;
      case 'SR': return sum + ws.srOwnership;
      default: return sum + ws.prOwnership;
    }
  }, 0);
  
  // Distribute to each controlled writer based on their relative share
  for (const writerShare of controlledWriterShares) {
    const ownership = lineItem.rightType === 'PR' ? writerShare.prOwnership :
                      lineItem.rightType === 'MR' ? writerShare.mrOwnership :
                      writerShare.srOwnership;
    
    const relativeShare = totalControlledShare > 0 ? ownership / totalControlledShare : 0;
    const writerGross = lineItem.grossAmount * relativeShare;
    
    // Get fee percentage (from agreement or default)
    const feePercent = writerShare.writer?.agreement?.adminFee ?? 
                       defaultPublisherFee;
    
    const feeAmount = writerGross * (feePercent / 100);
    const writerNet = writerGross - feeAmount;
    
    publisherShare += feeAmount;
    
    distributions.push({
      writerId: writerShare.writerId,
      writer: writerShare.writer,
      share: ownership,
      grossAmount: writerGross,
      publisherFee: feeAmount,
      netAmount: writerNet,
    });
  }
  
  // Add publisher's owned share (from publisher shares on the work)
  const publisherShares = work.publisherShares || [];
  const publisherOwnedShare = publisherShares.reduce((sum, ps) => {
    switch (lineItem.rightType) {
      case 'PR': return sum + ps.prCollection;
      case 'MR': return sum + ps.mrCollection;
      case 'SR': return sum + ps.srCollection;
      default: return sum + ps.prCollection;
    }
  }, 0);
  
  if (publisherOwnedShare > 0) {
    const publisherOwnedAmount = lineItem.grossAmount * (publisherOwnedShare / 100);
    publisherShare += publisherOwnedAmount;
  }
  
  return {
    lineItemId: lineItem.id,
    workId: work.id,
    workTitle: work.title,
    totalGross: lineItem.grossAmount,
    distributions,
    publisherShare,
    errors,
  };
};

// Generate a comprehensive distribution report for a statement
export const generateDistributionReport = (
  statement: RoyaltyStatement,
  works: Work[],
  defaultPublisherFee: number = 25
): DistributionReport => {
  const byWriter = new Map<string, {
    writer: Writer;
    grossAmount: number;
    feeAmount: number;
    netAmount: number;
    works: Array<{
      workTitle: string;
      grossAmount: number;
      feeAmount: number;
      netAmount: number;
    }>;
  }>();
  
  let totalGross = 0;
  let totalFees = 0;
  let totalNet = 0;
  let publisherFeeIncome = 0;
  let publisherOwnedShare = 0;
  
  for (const lineItem of statement.lineItems) {
    if (!lineItem.workId || !lineItem.matched) continue;
    
    const work = works.find(w => w.id === lineItem.workId);
    if (!work) continue;
    
    const result = calculateDistribution(lineItem, work, defaultPublisherFee);
    
    totalGross += result.totalGross;
    
    for (const dist of result.distributions) {
      const writerId = dist.writerId;
      
      if (!byWriter.has(writerId)) {
        byWriter.set(writerId, {
          writer: dist.writer!,
          grossAmount: 0,
          feeAmount: 0,
          netAmount: 0,
          works: [],
        });
      }
      
      const writerData = byWriter.get(writerId)!;
      writerData.grossAmount += dist.grossAmount;
      writerData.feeAmount += dist.publisherFee;
      writerData.netAmount += dist.netAmount;
      writerData.works.push({
        workTitle: work.title,
        grossAmount: dist.grossAmount,
        feeAmount: dist.publisherFee,
        netAmount: dist.netAmount,
      });
      
      totalFees += dist.publisherFee;
      totalNet += dist.netAmount;
      publisherFeeIncome += dist.publisherFee;
    }
    
    // Calculate publisher's owned share
    const workPubShares = work.publisherShares || [];
    const pubOwnedShare = workPubShares.reduce((sum, ps) => {
      switch (lineItem.rightType) {
        case 'PR': return sum + ps.prCollection;
        case 'MR': return sum + ps.mrCollection;
        case 'SR': return sum + ps.srCollection;
        default: return sum + ps.prCollection;
      }
    }, 0);
    
    const pubOwnedAmount = lineItem.grossAmount * (pubOwnedShare / 100);
    publisherOwnedShare += pubOwnedAmount;
  }
  
  return {
    statementId: statement.id,
    source: statement.source,
    period: statement.period,
    generatedAt: new Date(),
    totalGross,
    totalFees,
    totalNet,
    byWriter,
    publisherTotal: {
      grossAmount: publisherFeeIncome + publisherOwnedShare,
      feeIncome: publisherFeeIncome,
      ownedShare: publisherOwnedShare,
      totalIncome: publisherFeeIncome + publisherOwnedShare,
    },
  };
};

// Generate CSV export of distributions
export const generateDistributionCSV = (report: DistributionReport): string => {
  const rows: string[] = [];
  
  // Header
  rows.push([
    'Writer Name',
    'IPI Number',
    'Work Title',
    'Gross Amount',
    'Publisher Fee',
    'Net Amount',
    'Currency',
  ].join(','));
  
  // Writer rows
  for (const writerData of Array.from(report.byWriter.values())) {
    for (const workData of writerData.works) {
      rows.push([
        `"${writerData.writer.lastName}, ${writerData.writer.firstName || ''}"`,
        writerData.writer.ipiNameNumber || '',
        `"${workData.workTitle}"`,
        workData.grossAmount.toFixed(2),
        workData.feeAmount.toFixed(2),
        workData.netAmount.toFixed(2),
        'USD',
      ].join(','));
    }
    
    // Writer subtotal
    rows.push([
      `"${writerData.writer.lastName}, ${writerData.writer.firstName || ''} - TOTAL"`,
      '',
      '',
      writerData.grossAmount.toFixed(2),
      writerData.feeAmount.toFixed(2),
      writerData.netAmount.toFixed(2),
      'USD',
    ].join(','));
  }
  
  // Summary
  rows.push('');
  rows.push(`"TOTAL GROSS",,,${report.totalGross.toFixed(2)},,,"USD"`);
  rows.push(`"TOTAL FEES",,,,${report.totalFees.toFixed(2)},,"USD"`);
  rows.push(`"TOTAL NET",,,,,${report.totalNet.toFixed(2)},"USD"`);
  rows.push(`"PUBLISHER FEE INCOME",,,,${report.publisherTotal.feeIncome.toFixed(2)},,"USD"`);
  rows.push(`"PUBLISHER OWNED SHARE",,,${report.publisherTotal.ownedShare.toFixed(2)},,,"USD"`);
  rows.push(`"PUBLISHER TOTAL INCOME",,,${report.publisherTotal.totalIncome.toFixed(2)},,,"USD"`);
  
  return rows.join('\n');
};

// Match royalty line items to works
export const matchRoyaltyLineItems = (
  lineItems: Omit<RoyaltyLineItem, 'matched' | 'workId' | 'work'>[],
  works: Work[]
): RoyaltyLineItem[] => {
  return lineItems.map(item => {
    let matchedWork: Work | undefined;
    
    // Try to match by ISWC
    if (item.iswc) {
      matchedWork = works.find(w => w.iswc === item.iswc);
    }
    
    // Try to match by title
    if (!matchedWork && item.workTitle) {
      const normalizedTitle = item.workTitle.toLowerCase().trim();
      matchedWork = works.find(w => 
        w.title.toLowerCase().trim() === normalizedTitle ||
        w.alternateTitles.some(at => at.title.toLowerCase().trim() === normalizedTitle)
      );
    }
    
    return {
      ...item,
      workId: matchedWork?.id,
      work: matchedWork,
      matched: !!matchedWork,
    } as RoyaltyLineItem;
  });
};

// Parse royalty statement CSV
export interface ParsedRoyaltyRow {
  workTitle?: string;
  iswc?: string;
  territory?: string;
  rightType?: 'PR' | 'MR' | 'SR';
  usageType?: string;
  units?: number;
  grossAmount: number;
  netAmount?: number;
}

export const parseRoyaltyCSV = (
  csvContent: string,
  columnMapping: {
    workTitle?: string;
    iswc?: string;
    territory?: string;
    rightType?: string;
    usageType?: string;
    units?: string;
    grossAmount: string;
    netAmount?: string;
  }
): { rows: ParsedRoyaltyRow[]; errors: string[] } => {
  const errors: string[] = [];
  const rows: ParsedRoyaltyRow[] = [];

  const records = parseCSV(csvContent);
  if (records.length < 1) {
    errors.push('CSV must have at least a header row and one data row');
    return { rows, errors };
  }

  // Build normalized header map (normalized -> actual header key)
  const headers = Object.keys(records[0]);
  const colIndex: Record<string, string> = {};
  headers.forEach((h) => {
    colIndex[h.toLowerCase().replace(/\s+/g, '')] = h;
  });

  const getColKey = (mappedName?: string): string | undefined => {
    if (!mappedName) return undefined;
    return colIndex[(mappedName || '').toLowerCase().replace(/\s+/g, '')];
  };

  const grossKey = getColKey(columnMapping.grossAmount);
  if (!grossKey) {
    errors.push(`Required column "${columnMapping.grossAmount}" not found`);
    return { rows, errors };
  }

  records.forEach((rec, idx) => {
    try {
      const grossVal = (rec[grossKey] || '').replace(/"/g, '').trim();
      const grossAmount = parseFloat(grossVal) || 0;

      const row: ParsedRoyaltyRow = { grossAmount };

      const workTitleKey = getColKey(columnMapping.workTitle);
      if (workTitleKey) row.workTitle = (rec[workTitleKey] || '').replace(/"/g, '').trim();

      const iswcKey = getColKey(columnMapping.iswc);
      if (iswcKey) row.iswc = (rec[iswcKey] || '').replace(/"/g, '').trim();

      const territoryKey = getColKey(columnMapping.territory);
      if (territoryKey) row.territory = (rec[territoryKey] || '').replace(/"/g, '').trim();

      const rightTypeKey = getColKey(columnMapping.rightType);
      if (rightTypeKey) {
        const rt = ((rec[rightTypeKey] || '').replace(/"/g, '').trim()).toUpperCase();
        if (rt === 'PR' || rt === 'MR' || rt === 'SR') row.rightType = rt as 'PR' | 'MR' | 'SR';
      }

      const usageTypeKey = getColKey(columnMapping.usageType);
      if (usageTypeKey) row.usageType = (rec[usageTypeKey] || '').replace(/"/g, '').trim();

      const unitsKey = getColKey(columnMapping.units);
      if (unitsKey) {
        const u = parseInt((rec[unitsKey] || '').replace(/"/g, '').trim());
        if (!isNaN(u)) row.units = u;
      }

      const netAmountKey = getColKey(columnMapping.netAmount);
      if (netAmountKey) {
        const n = parseFloat((rec[netAmountKey] || '').replace(/"/g, '').trim());
        if (!isNaN(n)) row.netAmount = n;
      }

      rows.push(row);
    } catch (e) {
      errors.push(`Error parsing row ${idx + 1}`);
    }
  });

  return { rows, errors };
};
