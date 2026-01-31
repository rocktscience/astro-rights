// CSV Import Utilities for Music Publisher
// Maps CSV columns to entity fields based on real Airtable export structure

import type {
  Label,
  Artist,
  Publisher,
  Writer,
  Contact,
  InterestedParty,
  Agreement,
  AgreementParty,
  AgreementTerritory,
  AgreementType,
  AgreementSubType,
  AgreementStatus,
  BusinessStructure,
  InterestedPartyType,
  PartyRole,
  NetGrossType,
  PublisherRole,
  PROType,
} from '@/types';

// ===========================
// PARSING UTILITIES
// ===========================

export function parseCSV(csvText: string): Record<string, string>[] {
  const lines = csvText.split('\n');
  if (lines.length < 2) return [];
  
  // Parse header - handle BOM
  const headerLine = lines[0].replace(/^\uFEFF/, '');
  const headers = parseCSVLine(headerLine);
  
  const records: Record<string, string>[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = parseCSVLine(line);
    const record: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      record[header] = values[index] || '';
    });
    
    records.push(record);
  }
  
  return records;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // Skip the escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

function parseBoolean(value: string): boolean {
  const lower = value.toLowerCase().trim();
  return lower === 'yes' || lower === 'true' || lower === 'checked' || lower === '1';
}

function parseDate(value: string): Date | undefined {
  if (!value || value.trim() === '') return undefined;
  const date = new Date(value);
  return isNaN(date.getTime()) ? undefined : date;
}

function parseNumber(value: string): number | undefined {
  if (!value || value.trim() === '') return undefined;
  const num = parseFloat(value.replace(/[%,]/g, ''));
  return isNaN(num) ? undefined : num;
}

function parseStringArray(value: string): string[] {
  if (!value || value.trim() === '') return [];
  return value.split(',').map(s => s.trim()).filter(s => s.length > 0);
}

// ===========================
// LABEL IMPORT
// ===========================

export function mapLabelFromCSV(row: Record<string, string>): Omit<Label, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    labelId: row['Label ID'] || '',
    name: row['Name'] || '',
    isControlled: parseBoolean(row['Controlled']),
    dpid: row['DPID'] || undefined,
    pplId: row['PPL ID'] || undefined,
    labelCode: row['Label Code'] || undefined,
    isni: row['ISNI'] || undefined,
    interestedPartyName: row['Interested Party'] || undefined,
    recordingIds: [],
    recordingNames: parseStringArray(row['Recordings']),
    releaseIds: [],
    releaseNames: parseStringArray(row['Releases']),
  };
}

// ===========================
// ARTIST IMPORT
// ===========================

export function mapArtistFromCSV(row: Record<string, string>): Omit<Artist, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    artistId: row['Artist ID'] || '',
    name: row['Name'] || '',
    artistPhoto: row['Artist Photo'] || undefined,
    isControlled: parseBoolean(row['Controlled']),
    artistType: row['Artist Type'] || undefined,
    isni: row['ISNI'] || undefined,
    abramusId: row['Abramus ID'] || undefined,
    ecadId: row['Ecad ID'] || undefined,
    interestedPartyName: row['Interested Party'] || undefined,
    releaseIds: [],
    releaseNames: parseStringArray(row['Releases']),
    recordingIds: [],
    recordingNames: parseStringArray(row['Recordings']),
    artistShareIds: parseStringArray(row['Artist Share']),
    producerCreditIds: [],
    producerCreditNames: parseStringArray(row['Producer Credits']),
  };
}

// ===========================
// PUBLISHER IMPORT
// ===========================

export function mapPublisherFromCSV(row: Record<string, string>): Omit<Publisher, 'id' | 'createdAt' | 'updatedAt'> {
  const pro = row['PRO'] as PROType || 'NS';
  
  return {
    publisherId: row['Publisher ID'] || '',
    name: row['Name'] || '',
    isControlled: parseBoolean(row['Controlled']),
    ipi: row['IPI'] || undefined,
    ipiNameNumber: row['IPI Name Number'] || undefined,
    pNumber: row['P Number'] || undefined,
    dpid: row['DPID'] || undefined,
    isni: row['ISNI'] || undefined,
    abramusId: row['Abramus ID'] || undefined,
    ecadId: row['Ecad ID'] || undefined,
    cmrraAccountNumber: row['CMRRA Account #'] || undefined,
    pro: pro,
    mech: row['Mech'] || undefined,
    sync: row['Sync'] || undefined,
    cwrSenderId: row['CWR Sender ID'] || undefined,
    cwrSenderCode: row['CWR Sender Code'] || undefined,
    adminCoPublisher: row['Admin/Co-Publisher'] || undefined,
    interestedPartyName: row['Interested Party'] || undefined,
    publishingShareIds: parseStringArray(row['Publishing Shares']),
    role: 'E' as PublisherRole, // Default to Original Publisher
  };
}

// ===========================
// WRITER IMPORT
// ===========================

export function mapWriterFromCSV(row: Record<string, string>): Omit<Writer, 'id' | 'createdAt' | 'updatedAt'> {
  const pro = row['PRO'] as PROType || 'NS';
  
  return {
    writerId: row['Writer ID'] || '',
    name: row['Name'] || '',
    firstName: row['First Name'] || undefined,
    middleName: row['Middle Name'] || undefined,
    lastName: row['Last Name'] || undefined,
    isControlled: parseBoolean(row['Controlled']),
    ipi: row['IPI'] || undefined,
    ipiNameNumber: row['IPI Name Number'] || undefined,
    ipn: row['International Performer Number (IPN)'] || undefined,
    abramusId: row['Abramus ID'] || undefined,
    ecadId: row['Ecad ID'] || undefined,
    pro: pro,
    mech: row['Mech'] || undefined,
    sync: row['Sync'] || undefined,
    interestedPartyName: row['Interested Party'] || undefined,
    writerShareIds: parseStringArray(row['Writer Shares']),
  };
}

// ===========================
// CONTACT IMPORT
// ===========================

export function mapContactFromCSV(row: Record<string, string>): Omit<Contact, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    contactId: row['Contact ID'] || '',
    contactName: row['Contact Name'] || '',
    firstName: row['First Name'] || undefined,
    middleName: row['Middle Name'] || undefined,
    lastName: row['Last Name'] || undefined,
    jobTitle: row['Job Title'] || undefined,
    dob: parseDate(row['DOB']),
    email: row['Email'] || undefined,
    phone: row['Phone'] || undefined,
    photoId: row['Photo ID'] || undefined,
    isCurrentClient: parseBoolean(row['Current Client']),
    interestedPartyIds: [],
    interestedPartyNames: parseStringArray(row['Interested Party']),
    agreementPartyIds: parseStringArray(row['Agreement Party']),
    mixingEngineerRecordings: parseStringArray(row['Mixing Engineer']),
    engineerRecordings: parseStringArray(row['Engineer']),
    backgroundVocalsRecordings: parseStringArray(row['Background Vocals']),
    audioProductionRecordings: parseStringArray(row['Audio Production']),
    executiveProducerRecordings: parseStringArray(row['Executive Producer']),
    leadVocalsRecordings: parseStringArray(row['Lead Vocals']),
    masteringEngineerRecordings: parseStringArray(row['Mastering Engineer']),
  };
}

// ===========================
// INTERESTED PARTY IMPORT
// ===========================

function mapBusinessStructure(value: string): BusinessStructure {
  const map: Record<string, BusinessStructure> = {
    'limited liability company (llc)': 'Limited liability company (LLC)',
    'llc': 'Limited liability company (LLC)',
    'corporation': 'Corporation',
    'sole proprietorship': 'Sole proprietorship',
    'partnership': 'Partnership',
  };
  return map[value.toLowerCase()] || 'Unknown';
}

function mapInterestedPartyType(value: string): InterestedPartyType {
  const map: Record<string, InterestedPartyType> = {
    'label': 'Label',
    'publisher': 'Publisher',
    'artist': 'Artist',
    'writer': 'Writer',
    'producer': 'Producer',
    'artist management': 'Artist Management',
    'graphic design': 'Graphic Design',
  };
  return map[value.toLowerCase()] || 'Unknown';
}

export function mapInterestedPartyFromCSV(row: Record<string, string>): Omit<InterestedParty, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    interestedPartyId: row['Interested Party ID'] || '',
    name: row['Name'] || '',
    type: mapInterestedPartyType(row['Type']),
    businessStructure: mapBusinessStructure(row['Business Structure']),
    legalName: row['Legal Name'] || undefined,
    companyOwner: row['Company Owner'] || undefined,
    taxId: row['Tax ID'] || undefined,
    email: row['Email'] || undefined,
    phone: row['Phone'] || undefined,
    website: row['Website'] || undefined,
    fullPhysicalAddress: row['Full Physical Address'] || undefined,
    physicalAddress: row['Physical Address'] || undefined,
    physicalCity: row['Physical City'] || undefined,
    physicalState: row['Physical State'] || undefined,
    physicalZipCode: row['Physical Zip Code'] || undefined,
    physicalCountry: row['Physical Country'] || undefined,
    fullMailingAddress: row['Full Mailing Address'] || undefined,
    mailingAddress: row['Mailing Address'] || undefined,
    mailingCity: row['Mailing City'] || undefined,
    mailingState: row['Mailing State'] || undefined,
    mailingZipCode: row['Mailing Zip Code'] || undefined,
    mailingCountry: row['Mailing Country'] || undefined,
    hasW9: parseBoolean(row['W-9']),
    isControlled: parseBoolean(row['Controlled']),
    contactIds: [],
    contactNames: parseStringArray(row['Contacts']),
    labelIds: parseStringArray(row['Label']),
    artistIds: parseStringArray(row['Artist']),
    publisherIds: parseStringArray(row['Publisher']),
    writerIds: parseStringArray(row['Writer']),
    releaseIds: parseStringArray(row['Release']),
    masterOwnershipIds: parseStringArray(row['Master Ownership']),
    agreementPartyIds: parseStringArray(row['Agreement Party']),
    cwrTransactionIds: parseStringArray(row['CWR Transaction']),
  };
}

// ===========================
// AGREEMENT IMPORT
// ===========================

function mapAgreementType(value: string): AgreementType {
  const map: Record<string, AgreementType> = {
    'recording agreement': 'Recording Agreement',
    'recording': 'Recording Agreement',
    'publishing': 'Publishing',
    'publishing administration': 'Publishing Administration',
    'management': 'Management',
    'master': 'Master',
    'consulting': 'Consulting',
    'miscellaneous': 'Miscellaneous',
    'distribution': 'Distribution',
  };
  return map[value.toLowerCase()] || 'Miscellaneous';
}

function mapAgreementSubType(value: string): AgreementSubType | undefined {
  if (!value || value.trim() === '') return undefined;
  const v = value.trim().toLowerCase();
  const map: Record<string, AgreementSubType> = {
    // Publishing
    'publishing administration': 'Publishing Administration',
    'administration': 'Publishing Administration',
    'co-publishing': 'Co-Publishing',
    'copublishing': 'Co-Publishing',
    'sub-publishing general': 'Sub-publishing General',
    'sub publishing general': 'Sub-publishing General',
    'sub-publishing specific': 'Sub-publishing Specific',
    'sub publishing specific': 'Sub-publishing Specific',
    'original general': 'Original General',
    'original specific': 'Original Specific',

    // Master
    'distribution': 'Distribution',

    // Management
    'artist management': 'Artist Management',

    // Fallback-friendly aliases
    'publishing': 'Original General',
    'sub-publishing': 'Sub-publishing General',
  };

  return map[v];
}

function mapAgreementStatus(value: string): AgreementStatus {
  const map: Record<string, AgreementStatus> = {
    'active': 'Active',
    'renewed': 'Renewed',
    'ended': 'Ended',
    'cancelled': 'Cancelled',
    'draft': 'Draft',
    'expired': 'Expired',
    'terminated': 'Terminated',
  };
  return map[value.toLowerCase()] || 'Draft';
}

export function mapAgreementFromCSV(row: Record<string, string>): Omit<Agreement, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    agreementId: row['Agreement ID'] || '',
    type: mapAgreementType(row['Type']),
    agreementType: mapAgreementSubType(row['Agreement Type']),
    status: mapAgreementStatus(row['Status']),
    language: row['Language'] || undefined,
    advance: parseNumber(row['Advance']),
    agreementStartDate: parseDate(row['Agreement Start Date']),
    term: parseNumber(row['Term']),
    options: parseNumber(row['Options']),
    renewalPeriod: parseNumber(row['Renewal Period']),
    autoRenewal: parseBoolean(row['Auto Renewal']),
    nonRenewalNoticePeriod: parseNumber(row['Non-Renewal Notice Period']),
    notifiedIntentOfNonRenewal: parseBoolean(row['Notified intent of Non-Renewal']),
    expirationDate: parseDate(row['Expiration Date']),
    ended: parseBoolean(row['Ended']),
    agreementEndDate: parseDate(row['Agreement End Date']),
    attachments: row['Attachments'] ? [row['Attachments']] : undefined,
    notes: row['Notes'] || undefined,
    agreementTerritoryIds: parseStringArray(row['Agreement Territories']),
    agreementPartyIds: parseStringArray(row['Agreement Parties']),
    numberOfWorks: parseNumber(row['Number of Works']) || 0,
    workIds: [],
    workTitles: parseStringArray(row['Works']),
    releaseIds: [],
    releaseTitles: parseStringArray(row['Releases']),
    sharesChange: parseBoolean(row['Shares Change']),
    smClause: parseBoolean(row['S/M Clause']),
    internationalStandardAgreementCode: row['International Standard Agreement Code'] || undefined,
    societyAssignedAgreementNumber: row['Society-assigned Agreement Number'] || undefined,
    sunsetYear1: parseNumber(row['Sunset (Yr. 1)']),
    sunsetYear2: parseNumber(row['Sunset (Yr 2)']),
    sunsetYear3: parseNumber(row['Sunset (Yr 3)']),
    songCommitment: parseNumber(row['Song Commitment']),
    digitalStreaming: parseNumber(row['Digital & Streaming']),
    usAlbum: parseNumber(row['US - Album']),
    usSingle: parseNumber(row['US - Single']),
    canada: parseNumber(row['Canada']),
    otherRoyalties: parseNumber(row['Other Royalties']),
    yr1SingleCommit: parseNumber(row['Yr 1 Single Commit']),
    yr1VideoCommit: parseNumber(row['Yr 1 Video Commit']),
    followingYrsRecCommit: parseNumber(row['Following Yrs Rec Commit']),
    followingYrsAlbumCommit: parseNumber(row['Following Yrs Album Commit']),
    followingYrsSingleCommit: parseNumber(row['Following Yrs Single Commit']),
    followingYrsVideoCommit: parseNumber(row['Following Yrs Video Commit']),
    renewalAlbumCommit: parseNumber(row['Renewal Album Commit']),
    renewalRecCommit: parseNumber(row['Renewal Rec Commit']),
    renewalSingleCommit: parseNumber(row['Renewal Single Commit']),
    renewalVideoCommit: parseNumber(row['Renewal Video Commit']),
    consults: parseBoolean(row['Consults']),
  };
}

// ===========================
// AGREEMENT PARTY IMPORT
// ===========================

function mapPartyRole(value: string): PartyRole {
  const map: Record<string, PartyRole> = {
    'licensee': 'Licensee',
    'assignor': 'Assignor',
    'licensor': 'Licensor',
    'administrator': 'Administrator',
  };
  return map[value.toLowerCase()] || 'Assignor';
}

function mapNetGross(value: string): NetGrossType {
  return value.toLowerCase() === 'gross' ? 'Gross' : 'Net';
}

export function mapAgreementPartyFromCSV(row: Record<string, string>): Omit<AgreementParty, 'id' | 'createdAt' | 'updatedAt'> {
  const shareStr = row['Share'] || '';
  const sharePercent = parseNumber(shareStr.replace('%', ''));
  
  return {
    agreementPartyId: row['Agreement Party ID'] || '',
    agreementId: row['Agreement'] || '',
    interestedPartyName: row['Interested Party'] || undefined,
    partyRole: mapPartyRole(row['Party Role']),
    chain: parseInt(row['Chain']) || 1,
    signee: row['Signee'] || undefined,
    share: shareStr,
    sharePercent: sharePercent,
    netGross: mapNetGross(row['Net/Gross']),
    performanceShare: row['Performance Share'] || undefined,
    mechShare: row['Mech Share'] || undefined,
    syncShare: row['Sync Share'] || undefined,
    foreignRevenue: row['Foreign Revenue'] || undefined,
    sheetMusic: row['Sheet Music'] || undefined,
    otherIncome: row['Other Income'] || undefined,
  };
}

// ===========================
// AGREEMENT TERRITORY IMPORT
// ===========================

export function mapAgreementTerritoryFromCSV(row: Record<string, string>): Omit<AgreementTerritory, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    agreementTerritoryId: row['Agreement Territory ID'] || '',
    agreementId: row['Agreement'] || '',
    inclusionExclusion: row['Inclusion/Exclusion'] === 'Exclusion' ? 'Exclusion' : 'Inclusion',
    territory: row['Territory'] || 'World',
  };
}

// ===========================
// BATCH IMPORT FUNCTION
// ===========================

export interface ImportStats {
  total: number;
  imported: number;
  skipped: number;
  errors: string[];
}

export function importEntities<T>(
  csvText: string,
  mapFunction: (row: Record<string, string>) => T,
  validateFunction?: (entity: T) => boolean
): { entities: T[]; stats: ImportStats } {
  const records = parseCSV(csvText);
  const entities: T[] = [];
  const stats: ImportStats = {
    total: records.length,
    imported: 0,
    skipped: 0,
    errors: [],
  };
  
  for (let i = 0; i < records.length; i++) {
    try {
      const entity = mapFunction(records[i]);
      
      if (validateFunction && !validateFunction(entity)) {
        stats.skipped++;
        continue;
      }
      
      entities.push(entity);
      stats.imported++;
    } catch (error) {
      stats.errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      stats.skipped++;
    }
  }
  
  return { entities, stats };
}
