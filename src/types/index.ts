// Core entity types for music publishing - Expanded based on real data

export type UUID = string;

// ===========================
// ENUMS AND TYPE DEFINITIONS
// ===========================

// Writer capacity/role types per CWR specification
export type WriterCapacity = 
  | 'CA' // Composer/Author (writes music and lyrics)
  | 'C'  // Composer (writes music only)
  | 'A'  // Author/Lyricist (writes lyrics only)
  | 'AD' // Adapter
  | 'AR' // Arranger
  | 'SA' // Sub-Author
  | 'SR' // Sub-Arranger
  | 'TR' // Translator;

export type PublisherRole = 
  | 'E'  // Original Publisher
  | 'AM' // Administrator
  | 'SE' // Sub-Publisher
  | 'PA' // Income Participant;

export type AlternateTitleType =
  | 'AT' // Alternate Title
  | 'FT' // First Line of Text
  | 'IT' // Incorrect Title
  | 'OL' // Original Title in Original Language
  | 'OT' // Original Title
  | 'PT' // Part Title
  | 'RT' // Registered Title
  | 'ET' // Extra Search Title
  | 'TE' // Title for Excerpt;

export type VersionType = 
  | 'ORI' // Original Work
  | 'MOD' // Modified Version
  | 'ARR' // Arrangement
  | 'ADV' // Audio Visual Work;

export type WorkStatus = 
  | 'draft'
  | 'pending'
  | 'registered'
  | 'conflict'
  | 'rejected';

export type RegistrationStatus =
  | 'RA' // Registration Accepted
  | 'AS' // Accepted with Changes
  | 'RC' // Claim Rejected
  | 'DU' // Duplicate
  | 'CO' // Conflict
  | 'NP' // Not Processed
  | 'pending';

export type RightType = 'PR' | 'MR' | 'SR'; // Performance, Mechanical, Synchronization

export type UserRole = 'writer' | 'publisher' | 'artist' | 'label';

// PRO types based on real data
export type PROType = 'ASCAP' | 'BMI' | 'SESAC' | 'SOCAN' | 'PRS' | 'SACEM' | 'GEMA' | 'SGAE' | 'NS' | string;

// Mechanical rights organization types
export type MechType = 'HFA' | 'MLC' | 'CMRRA' | string;

// Business structure types based on Interested Party CSV
export type BusinessStructure = 
  | 'Limited liability company (LLC)'
  | 'Corporation'
  | 'Sole proprietorship'
  | 'Partnership'
  | 'Unknown';

// Artist types based on CSV
export type ArtistType = 'Artist' | 'Producer' | 'Artist,Producer' | string;

// Agreement types expanded based on CSV
export type AgreementType =
  // Canonical (Title Case)
  | 'Recording Agreement'
  | 'Publishing'
  | 'Publishing Administration'
  | 'Co-Publishing'
  | 'Sub-Publishing'
  | 'Management'
  | 'Master'
  | 'Consulting'
  | 'Miscellaneous'
  | 'Distribution'

  // Backward-compatible lowercase values used by some UI pages
  | 'publishing'
  | 'publishing administration'
  | 'administration'
  | 'co-publishing'
  | 'sub-publishing'
  | 'management'
  | 'master'
  | 'consulting'
  | 'miscellaneous'
  | 'distribution'
  | 'recording'
  | 'recording agreement';

export type AgreementSubType =
  | 'Recording'
  | 'Publishing Administration'
  | 'Co-Publishing'
  | 'Original General'
  | 'Original Specific'
  | 'Sub-publishing General'
  | 'Sub-publishing Specific'
  | 'Artist Management'
  | 'Distribution'
  | 'Consulting'
  | 'Mutual Termination';

export type AgreementStatus =
  // Canonical (Title Case)
  | 'Active'
  | 'Renewed'
  | 'Ended'
  | 'Cancelled'
  | 'Draft'
  | 'Expired'
  | 'Terminated'

  // Backward-compatible lowercase values used by some UI pages
  | 'active'
  | 'renewed'
  | 'ended'
  | 'cancelled'
  | 'draft'
  | 'expired'
  | 'terminated';

// Agreement Party roles
export type PartyRole = 'Licensee' | 'Assignor' | 'Licensor' | 'Administrator';

// Net/Gross type
export type NetGrossType = 'Net' | 'Gross';

// Interested Party types
export type InterestedPartyType = 
  | 'Label'
  | 'Publisher'
  | 'Artist'
  | 'Writer'
  | 'Producer'
  | 'Artist Management'
  | 'Graphic Design'
  | 'Unknown';

// ===========================
// SOCIETY INTERFACE
// ===========================

export interface Society {
  id: UUID;
  code: string;        // CISAC numeric code (e.g., "021" for ASCAP)
  name: string;
  territory: string;
  type: 'PRO' | 'MRO' | 'SRO';
}

// ===========================
// TERRITORY INTERFACE
// ===========================

export interface Territory {
  code: string;  // TIS-N code
  name: string;
  included: boolean;
}

// ===========================
// CONTACT - NEW ENTITY
// ===========================

export interface Contact {
  id: UUID;
  contactId: string;           // e.g., "RCON10001"
  contactName: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  jobTitle?: string;
  dob?: Date;
  email?: string;
  phone?: string;
  photoId?: string;
  isCurrentClient: boolean;
  
  // Related entities (references)
  interestedPartyIds: string[];  // Can be linked to multiple interested parties
  interestedPartyNames?: string[];
  agreementPartyIds: string[];
  
  // Recording credits
  mixingEngineerRecordings: string[];
  engineerRecordings: string[];
  backgroundVocalsRecordings: string[];
  audioProductionRecordings: string[];
  executiveProducerRecordings: string[];
  leadVocalsRecordings: string[];
  masteringEngineerRecordings: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

// ===========================
// INTERESTED PARTY - NEW ENTITY
// ===========================

export interface InterestedParty {
  id: UUID;
  interestedPartyId: string;   // e.g., "RIPY10001"
  name: string;
  type: InterestedPartyType;
  businessStructure: BusinessStructure;
  legalName?: string;
  companyOwner?: string;
  taxId?: string;
  email?: string;
  phone?: string;
  website?: string;
  
  // Physical Address
  fullPhysicalAddress?: string;
  physicalAddress?: string;
  physicalCity?: string;
  physicalState?: string;
  physicalZipCode?: string;
  physicalCountry?: string;
  
  // Mailing Address
  fullMailingAddress?: string;
  mailingAddress?: string;
  mailingCity?: string;
  mailingState?: string;
  mailingZipCode?: string;
  mailingCountry?: string;
  
  // Documents
  hasW9: boolean;
  
  // Control flag
  isControlled: boolean;
  
  // Related entity IDs (for lookups)
  contactIds: string[];
  contactNames?: string[];
  labelIds: string[];
  artistIds: string[];
  publisherIds: string[];
  writerIds: string[];
  releaseIds: string[];
  masterOwnershipIds: string[];
  agreementPartyIds: string[];
  cwrTransactionIds: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

// ===========================
// LABEL - EXPANDED
// ===========================

export interface Label {
  id: UUID;
  labelId: string;             // e.g., "RLAB10001"
  name: string;
  isControlled: boolean;
  
  // Identifiers
  dpid?: string;               // Distributor Party ID
  pplId?: string;              // PPL Label ID
  labelCode?: string;          // GVL Label Code
  isni?: string;               // International Standard Name Identifier
  
  // Related entities
  interestedPartyId?: string;
  interestedPartyName?: string;
  
  // Related content (stored as comma-separated IDs or names)
  recordingIds: string[];
  recordingNames?: string[];
  releaseIds: string[];
  releaseNames?: string[];
  
  // Parent/child relationships
  parentLabelId?: UUID;
  parentLabel?: Label;
  
  createdAt: Date;
  updatedAt: Date;
}

// ===========================
// ARTIST - EXPANDED
// ===========================

export interface Artist {
  id: UUID;
  artistId: string;            // e.g., "RART10001"
  name: string;
  artistPhoto?: string;
  isControlled: boolean;
  
  // Type
  artistType?: ArtistType;     // "Artist", "Producer", "Artist,Producer"
  
  // Identifiers
  isni?: string;               // International Standard Name Identifier
  ipn?: string;                // International Performer Number
  abramusId?: string;
  ecadId?: string;
  
  // Related entities
  interestedPartyId?: string;
  interestedPartyName?: string;
  
  // Related content
  releaseIds: string[];
  releaseNames?: string[];
  recordingIds: string[];
  recordingNames?: string[];
  artistShareIds: string[];
  producerCreditIds: string[];
  producerCreditNames?: string[];
  
  // Legacy fields for backwards compatibility
  firstName?: string;
  lastName?: string;
  agreementId?: UUID;
  agreement?: Agreement;
  
  createdAt: Date;
  updatedAt: Date;
}

// ===========================
// PUBLISHER - EXPANDED
// ===========================

export interface Publisher {
  id: UUID;
  publisherId: string;         // e.g., "RPUB10001"
  name: string;
  isControlled: boolean;
  
  // Identifiers
  ipi?: string;                // IPI number (11 digits)
  ipiNameNumber?: string;      // IPI Name Number
  ipiBaseNumber?: string;      // IPI Base Number (13 chars)
  pNumber?: string;            // P Number (mechanical licensing)
  dpid?: string;               // Distributor Party ID
  isni?: string;               // International Standard Name Identifier
  abramusId?: string;
  ecadId?: string;
  cmrraAccountNumber?: string;
  
  // Society affiliations
  pro?: PROType;               // Performance Rights Organization
  mech?: string;               // Mechanical Rights Organization
  sync?: string;               // Sync Rights
  prAffiliation?: Society;
  mrAffiliation?: Society;
  srAffiliation?: Society;
  
  // CWR delivery info
  cwrSenderId?: string;
  cwrSenderCode?: string;
  deliveryCode?: string;
  
  // Admin/Co-Publisher relationship
  adminCoPublisher?: string;
  adminCoPublisherId?: string;
  
  // Role
  role: PublisherRole;
  
  // Related entities
  interestedPartyId?: string;
  interestedPartyName?: string;
  
  // Related content
  publishingShareIds: string[];
  
  // Parent/child relationships
  parentPublisherId?: UUID;
  parentPublisher?: Publisher;
  
  // Legacy fields
  adminFee?: number;
  agreementId?: UUID;
  agreement?: Agreement;
  
  createdAt: Date;
  updatedAt: Date;
}

// ===========================
// WRITER - EXPANDED
// ===========================

export interface Writer {
  id: UUID;
  writerId: string;            // e.g., "RWRI10001"
  name: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  isControlled: boolean;
  
  // Identifiers
  ipi?: string;                // IPI number
  ipiNameNumber?: string;      // IPI Name Number
  ipiBaseNumber?: string;      // IPI Base Number
  ipn?: string;                // International Performer Number
  abramusId?: string;
  ecadId?: string;
  
  // Society affiliations
  pro?: PROType;               // Performance Rights Organization
  mech?: string;               // Mechanical Rights
  sync?: string;               // Sync Rights
  prAffiliation?: Society;
  mrAffiliation?: Society;
  srAffiliation?: Society;
  
  // Related entities
  interestedPartyId?: string;
  interestedPartyName?: string;
  
  // Related content
  writerShareIds: string[];
  
  // Legacy fields
  agreementId?: UUID;
  agreement?: Agreement;
  
  createdAt: Date;
  updatedAt: Date;
}

// ===========================
// AGREEMENT TERRITORY - NEW ENTITY
// ===========================

export interface AgreementTerritory {
  id: UUID;
  agreementTerritoryId: string;  // e.g., "RAGR10001-2WL-I"
  agreementId: string;
  inclusionExclusion: 'Inclusion' | 'Exclusion';
  territory: string;             // e.g., "World", "US", "EU"
  territoryCode?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

// ===========================
// AGREEMENT PARTY - NEW ENTITY
// ===========================

export interface AgreementParty {
  id: UUID;
  agreementPartyId: string;      // e.g., "RAGR10001-LIC-A"
  agreementId: string;
  
  // Party info
  interestedPartyId?: string;
  interestedPartyName?: string;
  partyRole: PartyRole;
  chain: number;                 // Chain of title position
  signee?: string;
  
  // Share info
  share?: string;                // e.g., "100.00%"
  sharePercent?: number;         // Numeric version
  netGross?: NetGrossType;
  
  // Specific shares
  performanceShare?: string;
  mechShare?: string;
  syncShare?: string;
  foreignRevenue?: string;
  sheetMusic?: string;
  otherIncome?: string;
  
  // Related contact
  contactId?: string;
  contactName?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

// ===========================
// AGREEMENT - EXPANDED
// ===========================

export interface Agreement {
  id: UUID;
  agreementId: string;           // e.g., "RAGR10001"
  type: AgreementType;
  agreementType?: AgreementSubType;
  title?: string;
  status: AgreementStatus;
  language?: string;             // e.g., "English", "Español"
  
  // Financial terms
  advance?: number;
  advanceCurrency?: string;
  
  // Term dates
  agreementStartDate?: Date;
  term?: number;                 // Term in years or months
  options?: number;              // Number of options
  renewalPeriod?: number;        // Renewal period in months
  autoRenewal?: boolean;
  nonRenewalNoticePeriod?: number;  // Days
  notifiedIntentOfNonRenewal?: boolean;
  expirationDate?: Date;
  ended?: boolean;
  agreementEndDate?: Date;
  
  // Retention
  retentionEndDate?: Date;
  priorRoyaltyStatus?: string;
  priorRoyaltyDate?: Date;
  postTermCollectionStatus?: string;
  postTermCollectionEndDate?: Date;
  
  // Attachments and notes
  attachments?: string[];        // URLs to attached documents
  notes?: string;
  
  // Related territories
  agreementTerritoryIds: string[];
  
  // Related parties
  agreementPartyIds: string[];
  
  // Related works
  numberOfWorks: number;
  workIds: string[];
  workTitles?: string[];
  
  // Related releases
  releaseIds: string[];
  releaseTitles?: string[];
  
  // Shares and clauses
  sharesChange?: boolean;
  smClause?: boolean;
  
  // CWR/Society info
  internationalStandardAgreementCode?: string;
  societyAssignedAgreementNumber?: string;
  
  // Sunset clause percentages
  sunsetYear1?: number;
  sunsetYear2?: number;
  sunsetYear3?: number;
  
  // Commitments
  songCommitment?: number;
  
  // Royalty rates
  digitalStreaming?: number;
  usAlbum?: number;
  usSingle?: number;
  canada?: number;
  otherRoyalties?: number;
  
  // Year commitments
  yr1SingleCommit?: number;
  yr1VideoCommit?: number;
  followingYrsRecCommit?: number;
  followingYrsAlbumCommit?: number;
  followingYrsSingleCommit?: number;
  followingYrsVideoCommit?: number;
  renewalAlbumCommit?: number;
  renewalRecCommit?: number;
  renewalSingleCommit?: number;
  renewalVideoCommit?: number;
  
  // Consults flag
  consults?: boolean;
  
  // Legacy fields for backward compatibility
  agreementNumber?: string;
  writerId?: UUID;
  writer?: Writer;
  publisherId?: UUID;
  publisher?: Publisher;
  artistId?: UUID;
  artist?: Artist;
  labelId?: UUID;
  label?: Label;
  adminFee?: number;
  termStartDate?: Date;
  termEndDate?: Date;
  territories?: Territory[];
  prShare?: number;
  mrShare?: number;
  srShare?: number;
  retentionPeriod?: number;
  
  createdAt: Date;
  updatedAt: Date;
}

// ===========================
// WRITER SHARE - EXPANDED
// ===========================

export interface WriterShare {
  id?: UUID;
  writerShareId?: string;        // e.g., "RWOR10001-W1"
  workId?: string;
  songName?: string;
  writerId: UUID;
  writer?: Writer;
  writerName?: string;
  
  // Unknown writer flag
  writerUnknown?: boolean;
  
  // Capacity/Role
  capacity: WriterCapacity;
  writerRole?: string;
  
  // Ownership percentages
  prOwnership: number;           // Performance rights ownership %
  mrOwnership: number;           // Mechanical rights ownership %
  srOwnership: number;           // Sync rights ownership %
  performanceShare?: string;
  mechShare?: string;
  syncShare?: string;
  
  // Controlling publisher
  publisherId?: UUID;
  publisher?: Publisher;
  
  // Territory info
  territoryIds?: string[];
  
  // Additional flags
  reversionary?: boolean;
  firstUseRestriction?: string;
  workForHire?: boolean;
  usaLicense?: string;
  
  // Chain of title
  chainOfTitle?: number;
  
  // Termination
  terminationDate?: Date;
  
  // Related publishing shares
  publishingShareIds?: string[];
  
  // SAAN
  saan?: string;
}

// ===========================
// PUBLISHER SHARE - EXPANDED
// ===========================

export interface PublisherShare {
  id?: UUID;
  publishingShareId?: string;    // e.g., "RWOR10001-W1-P-A"
  writerShareId?: string;
  songName?: string;
  writerName?: string;
  
  publisherId: UUID;
  publisher?: Publisher;
  publisherName?: string;
  
  // Unknown publisher flag
  publisherUnknown?: boolean;
  
  // Role
  role: PublisherRole;
  publisherRole?: string;
  
  // Ownership percentages
  prOwnership: number;
  mrOwnership: number;
  srOwnership: number;
  performanceShare?: string;
  mechShare?: string;
  syncShare?: string;
  
  // Collection shares
  prCollection: number;
  mrCollection: number;
  srCollection: number;
  
  // Territory info
  territories: Territory[];
  publisherTerritoryIds?: string[];
  
  // USA License
  usaLicense?: string;
  
  // Chain of title
  chainOfTitle?: number;
  
  // Shares change flag
  sharesChange?: boolean;
  
  // Termination
  terminationDate?: Date;
  
  // Admin/Sub relationships
  adminPublisherId?: UUID;
  adminPublisher?: Publisher;
  subPublisherId?: UUID;
  subPublisher?: Publisher;
  
  // Writer's performance share for reference
  writerPerformanceShare?: string;
}

// ===========================
// ALTERNATE TITLE
// ===========================

export interface AlternateTitle {
  id: UUID;
  title: string;
  type: AlternateTitleType;
  language?: string;
  workId?: string;
  workTitle?: string;
}

// ===========================
// RECORDING - EXPANDED
// ===========================

export interface Recording {
  id: UUID;
  recordingId: string;           // e.g., "RREC10001"
  title: string;
  trackName?: string;
  songName?: string;             // Linked work title
  isrc?: string;                 // International Standard Recording Code
  duration?: string;             // Duration as string "3:45"
  durationSeconds?: number;      // Duration in seconds
  isControlled: boolean;
  
  // Recording details
  recordingTechnique?: string;   // e.g., "Digital", "Analog"
  status?: string;
  explicit?: boolean;
  genre?: string;
  language?: string;
  recordingDate?: Date;
  
  // Copyright
  srCopyright?: string;
  sxid?: string;
  pplRecordingId?: string;
  
  // Track info
  discNumber?: number;
  trackNumber?: number;
  
  // TikTok
  tikTokStartTime?: number;
  
  // Related entities
  artistIds: UUID[];
  artists?: Artist[];
  artistNames?: string[];
  labelId?: UUID;
  label?: Label;
  labelName?: string;
  releaseId?: string;
  releaseName?: string;
  releaseDate?: Date;
  
  // Linked work
  workId?: UUID;
  work?: Work;
  
  // Streaming links
  spotifyId?: string;
  appleMusicId?: string;
  tidalId?: string;
  deezerId?: string;
  amazonMusicId?: string;
  napsterId?: string;
  pandoraId?: string;
  geniusId?: string;
  musixMatchId?: string;
  
  // Radio tracking
  mediabaseId?: string;
  nationalReportsId?: string;
  nielsenId?: string;
  
  // Video
  videoId?: string;
  
  // Credits (store as IDs)
  mixingEngineerId?: string;
  mixingEngineerName?: string;
  producerId?: string;
  producerName?: string;
  engineerId?: string;
  engineerName?: string;
  backgroundVocalsId?: string;
  backgroundVocalsName?: string;
  audioProductionId?: string;
  audioProductionName?: string;
  executiveProducerId?: string;
  executiveProducerName?: string;
  leadVocalsId?: string;
  leadVocalsName?: string;
  masteringEngineerId?: string;
  masteringEngineerName?: string;
  
  // Artist shares
  artistShareIds?: string[];
  
  // Master ownership
  masterOwnershipIds?: string[];
  
  // Legacy fields
  catalogNumber?: string;
  version?: string;
  agreementId?: UUID;
  agreement?: Agreement;
  
  createdAt: Date;
  updatedAt: Date;
}

// ===========================
// RELEASE - EXPANDED
// ===========================

export interface Release {
  id: UUID;
  releaseId: string;             // e.g., "RREL10001"
  releaseName: string;
  title?: string;
  releaseArtist?: string;
  coverArt?: string;
  upc?: string;                  // Universal Product Code
  releaseDate?: Date;
  isControlled: boolean;
  
  // Catalog info
  catalogNumber?: string;
  albumType?: string;            // "Album", "Single", "EP", "Compilation"
  releaseType?: 'album' | 'single' | 'ep' | 'compilation';
  status?: string;
  territory?: string;
  configuration?: string;        // "Digital", "CD", "Vinyl"
  version?: string;
  
  // Copyright
  pLine?: string;
  
  // Country info
  country?: string;
  countryOfMastering?: string;
  
  // Track count
  totalTracks?: number;
  
  // Related entities
  labelId?: UUID;
  label?: Label;
  labelName?: string;
  recordingIds: UUID[];
  recordings?: Recording[];
  recordingNames?: string[];
  
  // Links
  smartlink?: string;
  discogsUrl?: string;
  musicBrainzId?: string;
  allMusicUrl?: string;
  
  // Art
  artUrl?: string;
  
  // Agreement
  agreementId?: UUID;
  agreement?: Agreement;
  
  createdAt: Date;
  updatedAt: Date;
}

// ===========================
// WORK REGISTRATION
// ===========================

export interface WorkRegistration {
  id: UUID;
  workId: UUID;
  societyCode: string;
  societyName?: string;
  registrationNumber?: string;
  submissionDate: Date;
  responseDate?: Date;
  status: RegistrationStatus;
  cwrVersion: '2.1' | '2.2' | '3.0' | '3.1';
  transactionType: 'NWR' | 'REV';
  messages: RegistrationMessage[];
  assignedIswc?: string;
}

export interface RegistrationMessage {
  code: string;
  level: 'error' | 'warning' | 'info';
  field?: string;
  message: string;
}

// ===========================
// WORK - EXPANDED
// ===========================

export interface Work {
  id: UUID;
  workId: string;                // Internal work ID (e.g., "RWOR10001")
  title: string;
  workTitle?: string;
  iswc?: string;                 // International Standard Musical Work Code
  originalTitle?: string;
  duration?: string;
  language?: string;
  
  // Copyright info
  copyrightDate?: Date;
  copyrightNumber?: string;
  cLine?: string;
  
  // Work classification
  versionType: VersionType;
  musicalWorkDistributionCategory?: 'JAZ' | 'POP' | 'SER' | 'UNC';
  cwrWorkType?: string;
  
  // Composition details
  textMusicRelationship?: string;
  compositeType?: string;
  compositeComponentCount?: number;
  excerptType?: string;
  musicArrangement?: string;
  lyricAdaptation?: string;
  
  // Flags
  grandRights?: boolean;
  priorityFlag?: boolean;
  recordedIndicator?: string;
  
  // Shares
  writerShares: WriterShare[];
  publisherShares: PublisherShare[];
  
  // Alternate titles
  alternateTitles: AlternateTitle[];
  
  // Related recordings
  recordings: Recording[];
  recordingIds?: string[];
  
  // Registrations
  registrations: WorkRegistration[];
  
  // Agreement
  agreementId?: string;
  agreementIds?: string[];
  
  // CWR Group
  cwrGroup?: string;
  
  // External IDs
  ascapId?: string;
  bmiId?: string;
  mlcId?: string;
  mriId?: string;
  cmrraId?: string;
  lyricFindId?: string;
  musixMatchId?: string;
  apraAmcosId?: string;
  prsTunecodeId?: string;
  ecadId?: string;
  sesacId?: string;
  siaeId?: string;
  kodaId?: string;
  bumaId?: string;
  sabamId?: string;
  spaId?: string;
  sacemId?: string;
  sadaicId?: string;
  sgaeId?: string;
  sayceId?: string;
  socanId?: string;
  apdaycId?: string;
  gemaId?: string;
  iceId?: string;
  macpId?: string;
  komcaId?: string;
  
  // Action/status
  action?: string;
  status: WorkStatus;
  
  // Termination
  terminationDate?: Date;
  
  // Artist/Release info (from recording rollup)
  artistName?: string;
  releaseDateRollup?: string;
  
  // Reference works (for arrangements, etc.)
  workReferenceIds?: string[];
  
  createdAt: Date;
  updatedAt: Date;
}


// ===========================
// CWR EXPORT TYPES
// ===========================

export type CWRVersion = '2.1' | '2.2' | '3.0' | '3.1';
export type TransactionType = 'NWR' | 'REV';

export interface CWRExport {
  id: UUID;
  filename: string;
  version: '2.1' | '2.2' | '3.0' | '3.1';
  transactionType: 'NWR' | 'REV';
  workIds: UUID[];
  workCount: number;
  createdAt: Date;
  sentAt?: Date;
  recipientSociety?: string;
  status: 'draft' | 'generated' | 'sent' | 'acknowledged';

  // Output snapshot (set once generated)
  generatedAt?: Date;
  outputText?: string;
  outputSha256?: string;
}

export interface CWRGenerationOptions {
  version: '2.1' | '2.2' | '3.0' | '3.1';
  transactionType: 'NWR' | 'REV';
  recipientSociety: string;
  submitterCode: string;
  workIds: UUID[];
}

// ===========================
// METADATA COMPLETENESS + VALIDATION
// ===========================

export type EntityType =
  | 'work'
  | 'writer'
  | 'publisher'
  | 'artist'
  | 'label'
  | 'recording'
  | 'release'
  | 'agreement';

export type ValidationLevel = 'lenient' | 'standard' | 'strict';

export type ValidationIssueLevel = 'blocker' | 'warning' | 'info';

export interface ValidationIssue {
  code: string;
  level: ValidationIssueLevel;
  field?: string;
  message: string;
}

export interface CompletenessBreakdown {
  entityType: EntityType;
  entityId: UUID;
  percent: number; // 0-100
  criticalMissing: string[];
  needsAttention: string[];
  completed: string[];
  updatedAt: Date;
}

export interface CWRWorkEligibility {
  workId: UUID;
  version: CWRVersion;
  transactionType: TransactionType;
  level: ValidationLevel;
  eligible: boolean;
  blockers: ValidationIssue[];
  warnings: ValidationIssue[];
}

// ===========================
// ACK (ACKNOWLEDGMENT) TYPES
// ===========================

export interface ACKImport {
  id: UUID;
  filename: string;
  importedAt: Date;
  processedCount: number;
  acceptedCount: number;
  rejectedCount: number;
  records: ACKRecord[];
}

export interface ACKRecord {
  workId: string;
  transactionStatus: RegistrationStatus;
  societyWorkNumber?: string;
  iswc?: string;
  messages: RegistrationMessage[];
}

// ===========================
// ROYALTY TYPES
// ===========================

export interface RoyaltyStatement {
  id: UUID;
  source: string;       // Society or DSP name
  period: string;       // e.g., "2024-Q1"
  importedAt: Date;
  filename: string;
  totalGross: number;
  totalNet: number;
  currency: string;
  lineItems: RoyaltyLineItem[];
}

export interface RoyaltyLineItem {
  id: UUID;
  statementId: UUID;
  workId?: UUID;
  work?: Work;
  workTitle?: string;
  iswc?: string;
  territory?: string;
  rightType: RightType;
  usageType?: string;
  units?: number;
  grossAmount: number;
  netAmount: number;
  writerDistributions?: WriterDistribution[];
  matched: boolean;
}

export interface WriterDistribution {
  writerId: UUID;
  writer?: Writer;
  share: number;
  grossAmount: number;
  publisherFee: number;
  netAmount: number;
}

export interface RoyaltyDistributionReport {
  id: UUID;
  statementId: UUID;
  generatedAt: Date;
  periodStart: Date;
  periodEnd: Date;
  distributions: WriterDistribution[];
  totalGross: number;
  totalFees: number;
  totalNet: number;
}

// ===========================
// USER SETTINGS
// ===========================

export interface UserSettings {
  id: UUID;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  
  // User roles
  roles: UserRole[];
  
  // Linked entities
  linkedWriterId?: UUID;
  linkedPublisherId?: UUID;
  linkedArtistId?: UUID;
  linkedLabelId?: UUID;
  
  // Login credentials (for display only - not actual auth)
  username?: string;
  password?: string;
}

// ===========================
// PUBLISHER SETTINGS
// ===========================

export interface PublisherSettings {
  name: string;
  ipiNameNumber: string;
  ipiBaseNumber?: string;
  deliveryCode: string;
  prSociety: string;
  mrSociety?: string;
  srSociety?: string;
  defaultPrFee: number;
  defaultMrFee: number;
  defaultSrFee: number;
  ftpHost?: string;
  ftpUser?: string;
  ftpPassword?: string;
  ftpPath?: string;
}

// ===========================
// DASHBOARD STATISTICS
// ===========================

export interface DashboardStats {
  totalWorks: number;
  worksThisMonth: number;
  totalWriters: number;
  totalRecordings: number;
  pendingRegistrations: number;
  cwrExportsThisMonth: number;
  totalRoyalties: number;
  royaltiesThisQuarter: number;
  registrationsByStatus: Record<RegistrationStatus, number>;
  royaltiesBySource: Record<string, number>;
  recentWorks: Work[];
  recentExports: CWRExport[];
}

// ===========================
// FILTER/SEARCH TYPES
// ===========================

export interface WorkFilters {
  search?: string;
  status?: WorkStatus;
  versionType?: VersionType;
  writerId?: UUID;
  hasIswc?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface ImportResult {
  success: boolean;
  imported: number;
  updated?: number;
  skipped?: number;
  errors: string[];
  warnings: string[];
}

// ===========================
// MASTER OWNERSHIP - NEW ENTITY
// ===========================

export interface MasterOwnership {
  id: UUID;
  masterOwnershipId: string;     // e.g., "RREC10001-M-A"
  recordingId: string;
  recordingTitle?: string;
  masterOwnerId?: string;
  masterOwnerName?: string;
  isControlled: boolean;
  percentage?: string;
  percentageValue?: number;
  chainOfTitle?: number;
  copyrightOwnerCountry?: string;
  
  // Territory info
  territoryIds?: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

// ===========================
// ARTIST SHARE - NEW ENTITY
// ===========================

export interface ArtistShare {
  id: UUID;
  artistShareId: string;         // e.g., "RREC10001-A-A"
  recordingId: string;
  recordingTitle?: string;
  artistId: string;
  artistName?: string;
  featShare?: string;
  featSharePercent?: number;
  chainOfTitle?: number;
  isControlled: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

// ===========================
// VIDEO - NEW ENTITY
// ===========================

export interface Video {
  id: UUID;
  videoId: string;               // e.g., "RVID10001"
  videoName: string;
  recordingId?: string;
  recordingTitle?: string;
  isrcVideo?: string;
  upcVideo?: string;
  isControlled: boolean;
  videoThumbnail?: string;
  videoReleaseDate?: Date;
  
  // Territory
  videoTerritoryIds?: string[];
  
  // Links
  fbVideoLink?: string;
  youtubeLink?: string;
  youtubeAutoGeneratedAudioTrack?: string;
  closedCaption?: boolean;
  
  // Content ID
  contentIdClaimants?: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

// ===========================
// WRITER TERRITORY - NEW ENTITY
// ===========================

export interface WriterTerritory {
  id: UUID;
  writerTerritoryId: string;
  writerShareId: string;
  songName?: string;
  writerName?: string;
  performanceShare?: string;
  mechShare?: string;
  syncShare?: string;
  inclusionExclusion: 'Inclusion' | 'Exclusion';
  territory: string;
  terminationDate?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

// ===========================
// PUBLISHER TERRITORY - NEW ENTITY
// ===========================

export interface PublisherTerritory {
  id: UUID;
  publisherTerritoryId: string;
  publishingShareId: string;
  performanceShare?: string;
  mechShare?: string;
  syncShare?: string;
  inclusionExclusion: 'Inclusion' | 'Exclusion';
  territory: string;
  sharesChange?: boolean;
  terminationDate?: Date;
  publisherName?: string;
  songName?: string;
  writerName?: string;
  writerPerformanceShare?: string;
  
  createdAt: Date;
  updatedAt: Date;
}
