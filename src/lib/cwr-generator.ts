// CWR (Common Works Registration) Generator
// Supports CWR 2.1, 2.2, 3.0, and 3.1 specifications

import type { Work, PublisherSettings, CWRGenerationOptions, WriterShare, PublisherShare } from '@/types';
import { format } from 'date-fns';

// Helper functions for CWR field formatting
const ljust = (value: string, length: number): string => {
  return (value || '').substring(0, length).padEnd(length, ' ');
};

const rjust = (value: string | number, length: number, pad: string = '0'): string => {
  return String(value || '').substring(0, length).padStart(length, pad);
};

const formatShare = (share: number): string => {
  return rjust(Math.round(share * 100), 5);
};

const formatDate = (date: Date): string => {
  return format(date, 'yyyyMMdd');
};

const formatTime = (date: Date): string => {
  return format(date, 'HHmmss');
};

const formatDuration = (seconds?: number): string => {
  if (!seconds) return '000000';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${rjust(hours, 2)}${rjust(minutes, 2)}${rjust(secs, 2)}`;
};

interface CWRContext {
  transactionSequence: number;
  recordSequence: number;
  version: '2.1' | '2.2' | '3.0' | '3.1';
  settings: PublisherSettings;
  submitterCode: string;
  recipientSociety: string;
  transactionType: 'NWR' | 'REV';
}

const generateHDR = (ctx: CWRContext, creationDate: Date): string => {
  const recordType = 'HDR';
  const senderType = 'PB';
  const senderID = ljust(ctx.settings.ipiNameNumber || '', 11);
  const senderName = ljust(ctx.settings.name, 45);
  const ediVersion = ctx.version === '3.1' ? '03.01' : ctx.version === '3.0' ? '03.00' : ctx.version === '2.2' ? '02.20' : '02.10';
  const creationDateStr = formatDate(creationDate);
  const creationTimeStr = formatTime(creationDate);
  const transmissionDate = creationDateStr;
  const charSet = 'ASCII';
  
  return `${recordType}${senderType}${senderID}${senderName}${ljust(ediVersion, 5)}${creationDateStr}${creationTimeStr}${transmissionDate}${ljust(charSet, 15)}`;
};

const generateGRH = (ctx: CWRContext, groupId: number): string => {
  const recordType = 'GRH';
  const transactionType = ctx.transactionType;
  const groupIdStr = rjust(groupId, 5);
  const versionNumber = ctx.version === '2.1' ? '02.10' : ctx.version === '2.2' ? '02.20' : ctx.version === '3.0' ? '03.00' : '03.01';
  const batchRequest = rjust('', 10, ' ');
  
  return `${recordType}${transactionType}${groupIdStr}${ljust(versionNumber, 5)}${batchRequest}`;
};

const generateNWRorREV = (ctx: CWRContext, work: Work): string => {
  const recordType = ctx.transactionType;
  const transactionSeq = rjust(ctx.transactionSequence, 8);
  const recordSeq = rjust(ctx.recordSequence, 8);
  const workTitle = ljust(work.title.toUpperCase(), 60);
  const languageCode = ljust(work.language || 'EN', 2);
  const submitterWorkId = ljust(work.workId, 14);
  const iswc = ljust(work.iswc || '', 11);
  const copyrightDate = ljust('', 8);
  const copyrightNumber = ljust('', 12);
  const musicalWorkDistributionCategory = ljust(work.musicalWorkDistributionCategory || 'UNC', 3);
  const recordings = work.recordings || [];
  const duration = formatDuration(
    recordings[0]?.duration != null ? Number(recordings[0]?.duration) : undefined
  );
  const recordedIndicator = recordings.length > 0 ? 'Y' : 'U';
  const textMusicRelationship = 'MTX';
  const compositeType = ljust('', 3);
  const versionType = ljust(work.versionType === 'MOD' ? 'MOD' : 'ORI', 3);
  const excerptType = ljust('', 3);
  const musicArrangement = ljust('', 3);
  const lyricAdaptation = ljust('', 3);
  const contactName = ljust('', 30);
  const contactId = ljust('', 11);
  const cwrWorkType = ljust('', 2);
  const grandRightsInd = ' ';
  const compositeComponentCount = rjust('', 3, ' ');
  const dateOfPrintedEdition = ljust('', 8);
  const exceptionalClause = ' ';
  const opusNumber = ljust('', 25);
  const catalogueNumber = ljust('', 25);
  const priorityFlag = ' ';
  
  return `${recordType}${transactionSeq}${recordSeq}${workTitle}${languageCode}${submitterWorkId}${iswc}${copyrightDate}${copyrightNumber}${musicalWorkDistributionCategory}${duration}${recordedIndicator}${textMusicRelationship}${compositeType}${versionType}${excerptType}${musicArrangement}${lyricAdaptation}${contactName}${contactId}${cwrWorkType}${grandRightsInd}${compositeComponentCount}${dateOfPrintedEdition}${exceptionalClause}${opusNumber}${catalogueNumber}${priorityFlag}`;
};

const generateSPU = (ctx: CWRContext, share: PublisherShare, publisherSeq: number): string => {
  const recordType = 'SPU';
  const transactionSeq = rjust(ctx.transactionSequence, 8);
  const recordSeq = rjust(ctx.recordSequence, 8);
  const publisherSeqNum = rjust(publisherSeq, 2);
  const interestedPartyNum = ljust(`P${publisherSeq}`, 9);
  const publisherName = ljust(share.publisher?.name.toUpperCase() || ctx.settings.name.toUpperCase(), 45);
  const publisherType = share.role === 'E' ? 'E ' : share.role === 'AM' ? 'AM' : 'SE';
  const taxId = ljust('', 9);
  const ipiNameNum = ljust(share.publisher?.ipiNameNumber || ctx.settings.ipiNameNumber || '', 11);
  const submitterAgreementNum = ljust('', 14);
  const prAffiliationSoc = ljust(share.publisher?.prAffiliation?.code || ctx.settings.prSociety || '', 3);
  const prOwnership = formatShare(share.prOwnership);
  const mrAffiliationSoc = ljust(share.publisher?.mrAffiliation?.code || ctx.settings.mrSociety || '', 3);
  const mrOwnership = formatShare(share.mrOwnership);
  const srAffiliationSoc = ljust(share.publisher?.srAffiliation?.code || '', 3);
  const srOwnership = formatShare(share.srOwnership);
  const specialAgreements = ' ';
  const firstRecordingRefusal = ' ';
  const ipiBaseNum = ljust(share.publisher?.ipiBaseNumber || ctx.settings.ipiBaseNumber || '', 13);
  const intlStdAgreementCode = ljust('', 14);
  const societyAssignedAgreementNum = ljust('', 14);
  const agreementType = ljust('', 2);
  const usaLicense = ' ';
  
  return `${recordType}${transactionSeq}${recordSeq}${publisherSeqNum}${interestedPartyNum}${publisherName}${publisherType}${taxId}${ipiNameNum}${submitterAgreementNum}${prAffiliationSoc}${prOwnership}${mrAffiliationSoc}${mrOwnership}${srAffiliationSoc}${srOwnership}${specialAgreements}${firstRecordingRefusal}${ipiBaseNum}${intlStdAgreementCode}${societyAssignedAgreementNum}${agreementType}${usaLicense}`;
};

const generateSPT = (ctx: CWRContext, share: PublisherShare, publisherSeq: number): string[] => {
  const records: string[] = [];
  
  for (const territory of share.territories) {
    const recordType = 'SPT';
    const transactionSeq = rjust(ctx.transactionSequence, 8);
    const recordSeq = rjust(ctx.recordSequence++, 8);
    const interestedPartyNum = ljust(`P${publisherSeq}`, 9);
    const prCollectionShare = formatShare(share.prCollection);
    const mrCollectionShare = formatShare(share.mrCollection);
    const srCollectionShare = formatShare(share.srCollection);
    const inclusionExclusion = territory.included ? 'I' : 'E';
    const tisNumericCode = rjust(territory.code, 4);
    const sharesChange = ' ';
    const sequenceNum = rjust(1, 3);
    
    records.push(`${recordType}${transactionSeq}${recordSeq}${interestedPartyNum}${prCollectionShare}${mrCollectionShare}${srCollectionShare}${inclusionExclusion}${tisNumericCode}${sharesChange}${sequenceNum}`);
  }
  
  return records;
};

const generateSWR = (ctx: CWRContext, share: WriterShare, writerSeq: number): string => {
  const recordType = 'SWR';
  const transactionSeq = rjust(ctx.transactionSequence, 8);
  const recordSeq = rjust(ctx.recordSequence, 8);
  const interestedPartyNum = ljust(`W${writerSeq}`, 9);
  const writerLastName = ljust((share.writer?.lastName ?? '').toUpperCase(), 45);
  const writerFirstName = ljust(share.writer?.firstName?.toUpperCase() || '', 30);
  const writerDesignation = share.writer?.isControlled ? 'CA' : 'A ';
  const taxId = ljust('', 9);
  const ipiNameNum = ljust(share.writer?.ipiNameNumber || '', 11);
  const prAffiliationSoc = ljust(share.writer?.prAffiliation?.code || '', 3);
  const prOwnership = formatShare(share.prOwnership);
  const mrAffiliationSoc = ljust(share.writer?.mrAffiliation?.code || '', 3);
  const mrOwnership = formatShare(share.mrOwnership);
  const srAffiliationSoc = ljust(share.writer?.srAffiliation?.code || '', 3);
  const srOwnership = formatShare(share.srOwnership);
  const reversionary = ' ';
  const firstRecordingRefusal = ' ';
  const workForHire = ' ';
  const ipiBaseNum = ljust(share.writer?.ipiBaseNumber || '', 13);
  const personalNum = ljust('', 12);
  const usaLicense = ' ';
  
  return `${recordType}${transactionSeq}${recordSeq}${interestedPartyNum}${writerLastName}${writerFirstName}${writerDesignation}${taxId}${ipiNameNum}${prAffiliationSoc}${prOwnership}${mrAffiliationSoc}${mrOwnership}${srAffiliationSoc}${srOwnership}${reversionary}${firstRecordingRefusal}${workForHire}${ipiBaseNum}${personalNum}${usaLicense}`;
};

const generateSWT = (ctx: CWRContext, share: WriterShare, writerSeq: number): string => {
  const recordType = 'SWT';
  const transactionSeq = rjust(ctx.transactionSequence, 8);
  const recordSeq = rjust(ctx.recordSequence, 8);
  const interestedPartyNum = ljust(`W${writerSeq}`, 9);
  const prCollectionShare = formatShare(share.prOwnership / 2);
  const mrCollectionShare = formatShare(share.mrOwnership / 2);
  const srCollectionShare = formatShare(share.srOwnership / 2);
  const inclusionExclusion = 'I';
  const tisNumericCode = rjust('2136', 4);
  const sharesChange = ' ';
  const sequenceNum = rjust(1, 3);
  
  return `${recordType}${transactionSeq}${recordSeq}${interestedPartyNum}${prCollectionShare}${mrCollectionShare}${srCollectionShare}${inclusionExclusion}${tisNumericCode}${sharesChange}${sequenceNum}`;
};

const generateOWR = (ctx: CWRContext, share: WriterShare, writerSeq: number): string => {
  const recordType = 'OWR';
  const transactionSeq = rjust(ctx.transactionSequence, 8);
  const recordSeq = rjust(ctx.recordSequence, 8);
  const interestedPartyNum = ljust(`W${writerSeq}`, 9);
  const writerLastName = ljust((share.writer?.lastName ?? '').toUpperCase(), 45);
  const writerFirstName = ljust(share.writer?.firstName?.toUpperCase() || '', 30);
  const writerUnknown = ' ';
  const writerDesignation = ljust(share.capacity || 'CA', 2);
  const taxId = ljust('', 9);
  const ipiNameNum = ljust(share.writer?.ipiNameNumber || '', 11);
  const prAffiliationSoc = ljust(share.writer?.prAffiliation?.code || '', 3);
  const prOwnership = formatShare(share.prOwnership);
  const mrAffiliationSoc = ljust(share.writer?.mrAffiliation?.code || '', 3);
  const mrOwnership = formatShare(share.mrOwnership);
  const srAffiliationSoc = ljust(share.writer?.srAffiliation?.code || '', 3);
  const srOwnership = formatShare(share.srOwnership);
  const ipiBaseNum = ljust(share.writer?.ipiBaseNumber || '', 13);
  const personalNum = ljust('', 12);
  const usaLicense = ' ';
  
  return `${recordType}${transactionSeq}${recordSeq}${interestedPartyNum}${writerLastName}${writerFirstName}${writerUnknown}${writerDesignation}${taxId}${ipiNameNum}${prAffiliationSoc}${prOwnership}${mrAffiliationSoc}${mrOwnership}${srAffiliationSoc}${srOwnership}${ipiBaseNum}${personalNum}${usaLicense}`;
};

const generatePWR = (ctx: CWRContext, writerSeq: number, publisherSeq: number, share: WriterShare): string => {
  const recordType = 'PWR';
  const transactionSeq = rjust(ctx.transactionSequence, 8);
  const recordSeq = rjust(ctx.recordSequence, 8);
  const publisherInterestedPartyNum = ljust(`P${publisherSeq}`, 9);
  const publisherName = ljust(ctx.settings.name.toUpperCase(), 45);
  const submitterAgreementNum = ljust('', 14);
  const societyAssignedAgreementNum = ljust(share.saan || '', 14);
  const writerInterestedPartyNum = ljust(`W${writerSeq}`, 9);
  
  return `${recordType}${transactionSeq}${recordSeq}${publisherInterestedPartyNum}${publisherName}${submitterAgreementNum}${societyAssignedAgreementNum}${writerInterestedPartyNum}`;
};

const generateALT = (ctx: CWRContext, title: string, titleType: string): string => {
  const recordType = 'ALT';
  const transactionSeq = rjust(ctx.transactionSequence, 8);
  const recordSeq = rjust(ctx.recordSequence, 8);
  const alternateTitle = ljust(title.toUpperCase(), 60);
  const titleTypeCode = ljust(titleType, 2);
  const languageCode = ljust('EN', 2);
  
  return `${recordType}${transactionSeq}${recordSeq}${alternateTitle}${titleTypeCode}${languageCode}`;
};

const generatePER = (ctx: CWRContext, artistName: string, isni?: string): string => {
  const recordType = 'PER';
  const transactionSeq = rjust(ctx.transactionSequence, 8);
  const recordSeq = rjust(ctx.recordSequence, 8);
  const performingArtistLastName = ljust(artistName.toUpperCase(), 45);
  const performingArtistFirstName = ljust('', 30);
  const performingArtistIpiNameNum = ljust('', 11);
  const performingArtistIpiBaseNum = ljust('', 13);
  const performingArtistIsni = ljust(isni || '', 16);
  
  return `${recordType}${transactionSeq}${recordSeq}${performingArtistLastName}${performingArtistFirstName}${performingArtistIpiNameNum}${performingArtistIpiBaseNum}${performingArtistIsni}`;
};

const generateREC = (ctx: CWRContext, recording: { title: string; isrc?: string; duration?: number; releaseDate?: Date }): string => {
  const recordType = 'REC';
  const transactionSeq = rjust(ctx.transactionSequence, 8);
  const recordSeq = rjust(ctx.recordSequence, 8);
  const releaseDate = recording.releaseDate ? formatDate(recording.releaseDate) : ljust('', 8);
  const recordingDuration = formatDuration(recording.duration);
  const recordingTitle = ljust(recording.title.toUpperCase(), 60);
  const versionTitle = ljust('', 60);
  const displayArtist = ljust('', 60);
  const isrcCode = ljust(recording.isrc?.replace(/-/g, '') || '', 12);
  const recordingFormat = ljust('A', 1);
  const recordingTechnique = ljust('U', 1);
  const mediaType = ljust('', 3);
  
  return `${recordType}${transactionSeq}${recordSeq}${releaseDate}${recordingDuration}${recordingTitle}${versionTitle}${displayArtist}${isrcCode}${recordingFormat}${recordingTechnique}${mediaType}`;
};

const generateGRT = (ctx: CWRContext, groupId: number, transactionCount: number, recordCount: number): string => {
  const recordType = 'GRT';
  const groupIdStr = rjust(groupId, 5);
  const transactionCountStr = rjust(transactionCount, 8);
  const recordCountStr = rjust(recordCount, 8);
  
  return `${recordType}${groupIdStr}${transactionCountStr}${recordCountStr}`;
};

const generateTRL = (groupCount: number, transactionCount: number, recordCount: number): string => {
  const recordType = 'TRL';
  const groupCountStr = rjust(groupCount, 5);
  const transactionCountStr = rjust(transactionCount, 8);
  const recordCountStr = rjust(recordCount, 8);
  
  return `${recordType}${groupCountStr}${transactionCountStr}${recordCountStr}`;
};

export const generateCWR = (
  works: Work[],
  settings: PublisherSettings,
  options: CWRGenerationOptions
): { content: string; filename: string; records: string[] } => {
  const creationDate = new Date();
  const records: string[] = [];
  
  const ctx: CWRContext = {
    transactionSequence: 0,
    recordSequence: 0,
    version: options.version,
    settings,
    submitterCode: options.submitterCode || settings.deliveryCode,
    recipientSociety: options.recipientSociety,
    transactionType: options.transactionType,
  };
  
  records.push(generateHDR(ctx, creationDate));
  
  const groupId = 1;
  records.push(generateGRH(ctx, groupId));
  
  let transactionCount = 0;
  let recordCount = 2;
  
  for (const work of works) {
    ctx.transactionSequence++;
    ctx.recordSequence = 0;
    transactionCount++;
    
    ctx.recordSequence++;
    records.push(generateNWRorREV(ctx, work));
    recordCount++;
    
    let publisherSeq = 0;
    for (const publisherShare of work.publisherShares) {
      publisherSeq++;
      ctx.recordSequence++;
      records.push(generateSPU(ctx, publisherShare, publisherSeq));
      recordCount++;
      
      const sptRecords = generateSPT(ctx, publisherShare, publisherSeq);
      for (const sptRecord of sptRecords) {
        records.push(sptRecord);
        recordCount++;
      }
    }
    
    let writerSeq = 0;
    for (const writerShare of work.writerShares) {
      writerSeq++;
      ctx.recordSequence++;
      
      if (writerShare.writer?.isControlled) {
        records.push(generateSWR(ctx, writerShare, writerSeq));
        recordCount++;
        
        ctx.recordSequence++;
        records.push(generateSWT(ctx, writerShare, writerSeq));
        recordCount++;
        
        ctx.recordSequence++;
        records.push(generatePWR(ctx, writerSeq, 1, writerShare));
        recordCount++;
      } else {
        records.push(generateOWR(ctx, writerShare, writerSeq));
        recordCount++;
      }
    }
    
    for (const altTitle of work.alternateTitles) {
      ctx.recordSequence++;
      records.push(generateALT(ctx, altTitle.title, altTitle.type));
      recordCount++;
    }
    
    if (ctx.version === '3.0' || ctx.version === '3.1') {
      for (const recording of work.recordings) {
        for (const artist of recording.artists || []) {
          ctx.recordSequence++;
          const artistName = artist.firstName
            ? `${artist.lastName ?? ''}, ${artist.firstName}`.trim()
            : (artist.lastName ?? '');
          records.push(generatePER(ctx, artistName || 'UNKNOWN ARTIST', artist.isni));
          recordCount++;
        }
        
        ctx.recordSequence++;
        records.push(generateREC(ctx, {
          title: recording.title,
          isrc: recording.isrc,
          duration: recording.duration != null ? Number(recording.duration) : undefined,
          releaseDate: recording.releaseDate,
        }));
        recordCount++;
      }
    }
  }
  
  recordCount++;
  records.push(generateGRT(ctx, groupId, transactionCount, recordCount - 2));
  
  recordCount++;
  records.push(generateTRL(1, transactionCount, recordCount));
  
  const dateStr = format(creationDate, 'yyMMdd');
  const submitterCode = (settings.deliveryCode || 'XXX').substring(0, 3).toUpperCase();
  const recipientCode = (options.recipientSociety || 'XXX').substring(0, 3).toUpperCase();
  const versionCode = options.version === '3.1' ? 'V31' : options.version === '3.0' ? 'V30' : options.version === '2.2' ? 'V22' : 'V21';
  const filename = `CW${dateStr}${submitterCode}${recipientCode}.${versionCode}`;
  
  return {
    content: records.join('\r\n'),
    filename,
    records,
  };
};

export interface ACKParseResult {
  success: boolean;
  records: ACKParsedRecord[];
  errors: string[];
}

export interface ACKParsedRecord {
  recordType: string;
  transactionSequence: number;
  transactionStatus: string;
  submitterWorkNumber?: string;
  societyWorkNumber?: string;
  iswc?: string;
  messageType?: string;
  messageLevel?: string;
  validationNumber?: string;
  messageText?: string;
  originalRecord?: string;
}

export const parseACKFile = (content: string): ACKParseResult => {
  const lines = content.split(/\r?\n/).filter(line => line.trim());
  const records: ACKParsedRecord[] = [];
  const errors: string[] = [];
  
  for (const line of lines) {
    if (line.length < 3) continue;
    
    const recordType = line.substring(0, 3);
    
    try {
      switch (recordType) {
        case 'ACK': {
          const record: ACKParsedRecord = {
            recordType,
            transactionSequence: parseInt(line.substring(3, 11)) || 0,
            transactionStatus: line.substring(19, 21).trim(),
            submitterWorkNumber: line.substring(21, 35).trim() || undefined,
          };
          
          if (line.length > 35) {
            record.societyWorkNumber = line.substring(35, 49).trim() || undefined;
          }
          if (line.length > 49) {
            record.iswc = line.substring(49, 60).trim() || undefined;
          }
          
          records.push(record);
          break;
        }
        case 'MSG': {
          const record: ACKParsedRecord = {
            recordType,
            transactionSequence: parseInt(line.substring(3, 11)) || 0,
            transactionStatus: '',
            messageType: line.substring(19, 21).trim(),
            messageLevel: line.substring(21, 22).trim(),
            validationNumber: line.substring(22, 27).trim() || undefined,
            messageText: line.substring(27).trim() || undefined,
          };
          records.push(record);
          break;
        }
        case 'HDR':
        case 'GRH':
        case 'GRT':
        case 'TRL':
          break;
        default:
          records.push({
            recordType,
            transactionSequence: 0,
            transactionStatus: '',
            originalRecord: line,
          });
      }
    } catch (e) {
      errors.push(`Error parsing line: ${line.substring(0, 50)}...`);
    }
  }
  
  return { success: errors.length === 0, records, errors };
};

export const STATUS_DESCRIPTIONS: Record<string, { label: string; description: string; severity: 'success' | 'warning' | 'error' }> = {
  'RA': { label: 'Registration Accepted', description: 'Work has been successfully registered', severity: 'success' },
  'AS': { label: 'Accepted with Changes', description: 'Work accepted but with modifications', severity: 'warning' },
  'AC': { label: 'Accepted with Conflict', description: 'Work accepted but conflicts exist', severity: 'warning' },
  'RC': { label: 'Claim Rejected', description: 'Registration claim was rejected', severity: 'error' },
  'DU': { label: 'Duplicate', description: 'Work already exists in database', severity: 'warning' },
  'CO': { label: 'Conflict', description: 'Conflicting information detected', severity: 'error' },
  'NP': { label: 'Not Processed', description: 'Transaction was not processed', severity: 'error' },
  'PA': { label: 'Partial Agreement', description: 'Partial agreement on shares', severity: 'warning' },
};

export const validateCWR = (content: string): { valid: boolean; errors: string[]; warnings: string[] } => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const lines = content.split(/\r?\n/).filter(line => line.trim());
  
  if (lines.length < 4) {
    errors.push('CWR file must contain at least HDR, GRH, GRT, and TRL records');
    return { valid: false, errors, warnings };
  }
  
  if (!lines[0].startsWith('HDR')) {
    errors.push('First record must be HDR (Header)');
  }
  
  if (!lines[lines.length - 1].startsWith('TRL')) {
    errors.push('Last record must be TRL (Trailer)');
  }
  
  let hasNWR = false;
  let hasSPU = false;
  let hasSWR = false;
  
  for (const line of lines) {
    const recordType = line.substring(0, 3);
    if (recordType === 'NWR' || recordType === 'REV') hasNWR = true;
    if (recordType === 'SPU') hasSPU = true;
    if (recordType === 'SWR' || recordType === 'OWR') hasSWR = true;
  }
  
  if (!hasNWR) errors.push('No NWR or REV records found');
  if (!hasSPU) warnings.push('No SPU records found');
  if (!hasSWR) warnings.push('No SWR or OWR records found');
  
  return { valid: errors.length === 0, errors, warnings };
};
