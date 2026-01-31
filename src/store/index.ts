import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type {
  Work,
  Writer,
  Publisher,
  Recording,
  Artist,
  Label,
  Release,
  CWRExport,
  RoyaltyStatement,
  PublisherSettings,
  WorkFilters,
  Society,
  Agreement,
  UserSettings,
  Contact,
  InterestedParty,
  AgreementParty,
  AgreementTerritory,
  MasterOwnership,
  ArtistShare,
  Video,
  WriterTerritory,
  PublisherTerritory,
} from '@/types';

// Toast interface
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

// Sample societies data
const SOCIETIES: Society[] = [
  { id: '1', code: '021', name: 'ASCAP', territory: 'US', type: 'PRO' },
  { id: '2', code: '021', name: 'BMI', territory: 'US', type: 'PRO' },
  { id: '3', code: '021', name: 'SESAC', territory: 'US', type: 'PRO' },
  { id: '4', code: '034', name: 'PRS', territory: 'GB', type: 'PRO' },
  { id: '5', code: '058', name: 'SACEM', territory: 'FR', type: 'PRO' },
  { id: '6', code: '035', name: 'GEMA', territory: 'DE', type: 'PRO' },
  { id: '7', code: '052', name: 'SGAE', territory: 'ES', type: 'PRO' },
  { id: '8', code: '088', name: 'The MLC', territory: 'US', type: 'MRO' },
  { id: '9', code: '044', name: 'CMRRA', territory: 'CA', type: 'MRO' },
  { id: '10', code: '101', name: 'SOCAN', territory: 'CA', type: 'PRO' },
  { id: '11', code: 'NS', name: 'Not Specified', territory: '', type: 'PRO' },
];

// Store interface
interface MusicPublisherStore {
  // Theme
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  
  // Sidebar
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Toasts
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Publisher Settings
  publisherSettings: PublisherSettings | null;
  updatePublisherSettings: (settings: Partial<PublisherSettings>) => void;
  
  // Societies
  societies: Society[];
  
  // ===== CORE ENTITIES =====
  
  // Works
  works: Work[];
  addWork: (work: Omit<Work, 'id' | 'createdAt' | 'updatedAt'>) => Work;
  updateWork: (id: string, work: Partial<Work>) => void;
  deleteWork: (id: string) => void;
  bulkAddWorks: (works: Omit<Work, 'id' | 'createdAt' | 'updatedAt'>[]) => Work[];
  
  // Writers
  writers: Writer[];
  addWriter: (writer: Omit<Writer, 'id' | 'createdAt' | 'updatedAt'>) => Writer;
  updateWriter: (id: string, writer: Partial<Writer>) => void;
  deleteWriter: (id: string) => void;
  bulkAddWriters: (writers: Omit<Writer, 'id' | 'createdAt' | 'updatedAt'>[]) => Writer[];
  
  // Publishers
  publishers: Publisher[];
  addPublisher: (publisher: Omit<Publisher, 'id' | 'createdAt' | 'updatedAt'>) => Publisher;
  updatePublisher: (id: string, publisher: Partial<Publisher>) => void;
  deletePublisher: (id: string) => void;
  bulkAddPublishers: (publishers: Omit<Publisher, 'id' | 'createdAt' | 'updatedAt'>[]) => Publisher[];
  
  // Artists
  artists: Artist[];
  addArtist: (artist: Omit<Artist, 'id' | 'createdAt' | 'updatedAt'>) => Artist;
  updateArtist: (id: string, artist: Partial<Artist>) => void;
  deleteArtist: (id: string) => void;
  bulkAddArtists: (artists: Omit<Artist, 'id' | 'createdAt' | 'updatedAt'>[]) => Artist[];
  
  // Labels
  labels: Label[];
  addLabel: (label: Omit<Label, 'id' | 'createdAt' | 'updatedAt'>) => Label;
  updateLabel: (id: string, label: Partial<Label>) => void;
  deleteLabel: (id: string) => void;
  bulkAddLabels: (labels: Omit<Label, 'id' | 'createdAt' | 'updatedAt'>[]) => Label[];
  
  // Recordings
  recordings: Recording[];
  addRecording: (recording: Omit<Recording, 'id' | 'createdAt' | 'updatedAt'>) => Recording;
  updateRecording: (id: string, recording: Partial<Recording>) => void;
  deleteRecording: (id: string) => void;
  bulkAddRecordings: (recordings: Omit<Recording, 'id' | 'createdAt' | 'updatedAt'>[]) => Recording[];
  
  // Releases
  releases: Release[];
  addRelease: (release: Omit<Release, 'id' | 'createdAt' | 'updatedAt'>) => Release;
  updateRelease: (id: string, release: Partial<Release>) => void;
  deleteRelease: (id: string) => void;
  bulkAddReleases: (releases: Omit<Release, 'id' | 'createdAt' | 'updatedAt'>[]) => Release[];
  
  // ===== NEW ENTITIES =====
  
  // Contacts
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => Contact;
  updateContact: (id: string, contact: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  bulkAddContacts: (contacts: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>[]) => Contact[];
  
  // Interested Parties
  interestedParties: InterestedParty[];
  addInterestedParty: (party: Omit<InterestedParty, 'id' | 'createdAt' | 'updatedAt'>) => InterestedParty;
  updateInterestedParty: (id: string, party: Partial<InterestedParty>) => void;
  deleteInterestedParty: (id: string) => void;
  bulkAddInterestedParties: (parties: Omit<InterestedParty, 'id' | 'createdAt' | 'updatedAt'>[]) => InterestedParty[];
  
  // Agreements
  agreements: Agreement[];
  addAgreement: (agreement: Omit<Agreement, 'id' | 'createdAt' | 'updatedAt'>) => Agreement;
  updateAgreement: (id: string, agreement: Partial<Agreement>) => void;
  deleteAgreement: (id: string) => void;
  bulkAddAgreements: (agreements: Omit<Agreement, 'id' | 'createdAt' | 'updatedAt'>[]) => Agreement[];
  
  // Agreement Parties
  agreementParties: AgreementParty[];
  addAgreementParty: (party: Omit<AgreementParty, 'id' | 'createdAt' | 'updatedAt'>) => AgreementParty;
  updateAgreementParty: (id: string, party: Partial<AgreementParty>) => void;
  deleteAgreementParty: (id: string) => void;
  bulkAddAgreementParties: (parties: Omit<AgreementParty, 'id' | 'createdAt' | 'updatedAt'>[]) => AgreementParty[];
  
  // Agreement Territories
  agreementTerritories: AgreementTerritory[];
  addAgreementTerritory: (territory: Omit<AgreementTerritory, 'id' | 'createdAt' | 'updatedAt'>) => AgreementTerritory;
  updateAgreementTerritory: (id: string, territory: Partial<AgreementTerritory>) => void;
  deleteAgreementTerritory: (id: string) => void;
  bulkAddAgreementTerritories: (territories: Omit<AgreementTerritory, 'id' | 'createdAt' | 'updatedAt'>[]) => AgreementTerritory[];
  
  // Master Ownerships
  masterOwnerships: MasterOwnership[];
  addMasterOwnership: (ownership: Omit<MasterOwnership, 'id' | 'createdAt' | 'updatedAt'>) => MasterOwnership;
  updateMasterOwnership: (id: string, ownership: Partial<MasterOwnership>) => void;
  deleteMasterOwnership: (id: string) => void;
  bulkAddMasterOwnerships: (ownerships: Omit<MasterOwnership, 'id' | 'createdAt' | 'updatedAt'>[]) => MasterOwnership[];
  
  // Artist Shares
  artistShares: ArtistShare[];
  addArtistShare: (share: Omit<ArtistShare, 'id' | 'createdAt' | 'updatedAt'>) => ArtistShare;
  updateArtistShare: (id: string, share: Partial<ArtistShare>) => void;
  deleteArtistShare: (id: string) => void;
  bulkAddArtistShares: (shares: Omit<ArtistShare, 'id' | 'createdAt' | 'updatedAt'>[]) => ArtistShare[];
  
  // Videos
  videos: Video[];
  addVideo: (video: Omit<Video, 'id' | 'createdAt' | 'updatedAt'>) => Video;
  updateVideo: (id: string, video: Partial<Video>) => void;
  deleteVideo: (id: string) => void;
  bulkAddVideos: (videos: Omit<Video, 'id' | 'createdAt' | 'updatedAt'>[]) => Video[];
  
  // Writer Territories
  writerTerritories: WriterTerritory[];
  addWriterTerritory: (territory: Omit<WriterTerritory, 'id' | 'createdAt' | 'updatedAt'>) => WriterTerritory;
  updateWriterTerritory: (id: string, territory: Partial<WriterTerritory>) => void;
  deleteWriterTerritory: (id: string) => void;
  bulkAddWriterTerritories: (territories: Omit<WriterTerritory, 'id' | 'createdAt' | 'updatedAt'>[]) => WriterTerritory[];
  
  // Publisher Territories
  publisherTerritories: PublisherTerritory[];
  addPublisherTerritory: (territory: Omit<PublisherTerritory, 'id' | 'createdAt' | 'updatedAt'>) => PublisherTerritory;
  updatePublisherTerritory: (id: string, territory: Partial<PublisherTerritory>) => void;
  deletePublisherTerritory: (id: string) => void;
  bulkAddPublisherTerritories: (territories: Omit<PublisherTerritory, 'id' | 'createdAt' | 'updatedAt'>[]) => PublisherTerritory[];
  
  // ===== OTHER =====
  
  // User Settings
  userSettings: UserSettings | null;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  
  // CWR Exports
  cwrExports: CWRExport[];
  addCWRExport: (exportData: Omit<CWRExport, 'id' | 'createdAt'>) => CWRExport;
  updateCWRExport: (id: string, exportData: Partial<CWRExport>) => void;
  
  // Royalty Statements
  royaltyStatements: RoyaltyStatement[];
  addRoyaltyStatement: (statement: Omit<RoyaltyStatement, 'id' | 'importedAt'>) => RoyaltyStatement;
  
  // Clear all data
  clearAllData: () => void;
  clearEntityData: (entityType: string) => void;
  
  // Selection
  selectedWorkIds: string[];
  toggleWorkSelection: (id: string) => void;
  selectAllWorks: (ids: string[]) => void;
  clearWorkSelection: () => void;
  
  // Filters
  workFilters: WorkFilters;
  setWorkFilters: (filters: Partial<WorkFilters>) => void;
  clearWorkFilters: () => void;
  
  // Computed
  getFilteredWorks: () => Work[];
  getDashboardStats: () => {
    totalWorks: number;
    totalWriters: number;
    totalRecordings: number;
    totalArtists: number;
    totalLabels: number;
    totalPublishers: number;
    totalAgreements: number;
    totalContacts: number;
    totalInterestedParties: number;
    pendingRegistrations: number;
    totalRoyalties: number;
    registeredWorks: number;
    draftWorks: number;
  };
  
  // Lookup helpers
  getWriterById: (id: string) => Writer | undefined;
  getPublisherById: (id: string) => Publisher | undefined;
  getArtistById: (id: string) => Artist | undefined;
  getLabelById: (id: string) => Label | undefined;
  getAgreementById: (id: string) => Agreement | undefined;
  getContactById: (id: string) => Contact | undefined;
  getInterestedPartyById: (id: string) => InterestedParty | undefined;
  
  // Lookup by custom ID
  getWriterByWriterId: (writerId: string) => Writer | undefined;
  getPublisherByPublisherId: (publisherId: string) => Publisher | undefined;
  getArtistByArtistId: (artistId: string) => Artist | undefined;
  getLabelByLabelId: (labelId: string) => Label | undefined;
  getAgreementByAgreementId: (agreementId: string) => Agreement | undefined;
  getContactByContactId: (contactId: string) => Contact | undefined;
  getInterestedPartyByPartyId: (partyId: string) => InterestedParty | undefined;
}

export const useStore = create<MusicPublisherStore>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      
      // Sidebar
      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      
      // Toasts
      toasts: [],
      addToast: (toast) => {
        const newToast: Toast = { ...toast, id: uuidv4() };
        set((state) => ({ toasts: [...state.toasts, newToast] }));
        // Auto-remove after 5 seconds
        setTimeout(() => {
          set((state) => ({ toasts: state.toasts.filter((t) => t.id !== newToast.id) }));
        }, 5000);
      },
      removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
      
      // Publisher Settings
      publisherSettings: {
        name: 'Rocket Science Music Publishing',
        ipiNameNumber: '01189676982',
        deliveryCode: 'R18',
        prSociety: 'ASCAP',
        mrSociety: 'HFA',
        defaultPrFee: 10,
        defaultMrFee: 10,
        defaultSrFee: 15,
      },
      updatePublisherSettings: (settings) => set((state) => ({
        publisherSettings: state.publisherSettings 
          ? { ...state.publisherSettings, ...settings }
          : settings as PublisherSettings,
      })),
      
      // Societies
      societies: SOCIETIES,
      
      // ===== WORKS =====
      works: [],
      addWork: (workData) => {
        const newWork: Work = {
          ...workData,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ works: [...state.works, newWork] }));
        return newWork;
      },
      updateWork: (id, workData) => set((state) => ({
        works: state.works.map((w) =>
          w.id === id ? { ...w, ...workData, updatedAt: new Date() } : w
        ),
      })),
      deleteWork: (id) => set((state) => ({
        works: state.works.filter((w) => w.id !== id),
      })),
      bulkAddWorks: (worksData) => {
        const newWorks = worksData.map((w) => ({
          ...w,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        set((state) => ({ works: [...state.works, ...newWorks] }));
        return newWorks;
      },
      
      // ===== WRITERS =====
      writers: [],
      addWriter: (writerData) => {
        const newWriter: Writer = {
          ...writerData,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ writers: [...state.writers, newWriter] }));
        return newWriter;
      },
      updateWriter: (id, writerData) => set((state) => ({
        writers: state.writers.map((w) =>
          w.id === id ? { ...w, ...writerData, updatedAt: new Date() } : w
        ),
      })),
      deleteWriter: (id) => set((state) => ({
        writers: state.writers.filter((w) => w.id !== id),
      })),
      bulkAddWriters: (writersData) => {
        const newWriters = writersData.map((w) => ({
          ...w,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        set((state) => ({ writers: [...state.writers, ...newWriters] }));
        return newWriters;
      },
      
      // ===== PUBLISHERS =====
      publishers: [],
      addPublisher: (publisherData) => {
        const newPublisher: Publisher = {
          ...publisherData,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ publishers: [...state.publishers, newPublisher] }));
        return newPublisher;
      },
      updatePublisher: (id, publisherData) => set((state) => ({
        publishers: state.publishers.map((p) =>
          p.id === id ? { ...p, ...publisherData, updatedAt: new Date() } : p
        ),
      })),
      deletePublisher: (id) => set((state) => ({
        publishers: state.publishers.filter((p) => p.id !== id),
      })),
      bulkAddPublishers: (publishersData) => {
        const newPublishers = publishersData.map((p) => ({
          ...p,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        set((state) => ({ publishers: [...state.publishers, ...newPublishers] }));
        return newPublishers;
      },
      
      // ===== ARTISTS =====
      artists: [],
      addArtist: (artistData) => {
        const newArtist: Artist = {
          ...artistData,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ artists: [...state.artists, newArtist] }));
        return newArtist;
      },
      updateArtist: (id, artistData) => set((state) => ({
        artists: state.artists.map((a) =>
          a.id === id ? { ...a, ...artistData, updatedAt: new Date() } : a
        ),
      })),
      deleteArtist: (id) => set((state) => ({
        artists: state.artists.filter((a) => a.id !== id),
      })),
      bulkAddArtists: (artistsData) => {
        const newArtists = artistsData.map((a) => ({
          ...a,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        set((state) => ({ artists: [...state.artists, ...newArtists] }));
        return newArtists;
      },
      
      // ===== LABELS =====
      labels: [],
      addLabel: (labelData) => {
        const newLabel: Label = {
          ...labelData,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ labels: [...state.labels, newLabel] }));
        return newLabel;
      },
      updateLabel: (id, labelData) => set((state) => ({
        labels: state.labels.map((l) =>
          l.id === id ? { ...l, ...labelData, updatedAt: new Date() } : l
        ),
      })),
      deleteLabel: (id) => set((state) => ({
        labels: state.labels.filter((l) => l.id !== id),
      })),
      bulkAddLabels: (labelsData) => {
        const newLabels = labelsData.map((l) => ({
          ...l,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        set((state) => ({ labels: [...state.labels, ...newLabels] }));
        return newLabels;
      },
      
      // ===== RECORDINGS =====
      recordings: [],
      addRecording: (recordingData) => {
        const newRecording: Recording = {
          ...recordingData,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ recordings: [...state.recordings, newRecording] }));
        return newRecording;
      },
      updateRecording: (id, recordingData) => set((state) => ({
        recordings: state.recordings.map((r) =>
          r.id === id ? { ...r, ...recordingData, updatedAt: new Date() } : r
        ),
      })),
      deleteRecording: (id) => set((state) => ({
        recordings: state.recordings.filter((r) => r.id !== id),
      })),
      bulkAddRecordings: (recordingsData) => {
        const newRecordings = recordingsData.map((r) => ({
          ...r,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        set((state) => ({ recordings: [...state.recordings, ...newRecordings] }));
        return newRecordings;
      },
      
      // ===== RELEASES =====
      releases: [],
      addRelease: (releaseData) => {
        const newRelease: Release = {
          ...releaseData,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ releases: [...state.releases, newRelease] }));
        return newRelease;
      },
      updateRelease: (id, releaseData) => set((state) => ({
        releases: state.releases.map((r) =>
          r.id === id ? { ...r, ...releaseData, updatedAt: new Date() } : r
        ),
      })),
      deleteRelease: (id) => set((state) => ({
        releases: state.releases.filter((r) => r.id !== id),
      })),
      bulkAddReleases: (releasesData) => {
        const newReleases = releasesData.map((r) => ({
          ...r,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        set((state) => ({ releases: [...state.releases, ...newReleases] }));
        return newReleases;
      },
      
      // ===== CONTACTS =====
      contacts: [],
      addContact: (contactData) => {
        const newContact: Contact = {
          ...contactData,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ contacts: [...state.contacts, newContact] }));
        return newContact;
      },
      updateContact: (id, contactData) => set((state) => ({
        contacts: state.contacts.map((c) =>
          c.id === id ? { ...c, ...contactData, updatedAt: new Date() } : c
        ),
      })),
      deleteContact: (id) => set((state) => ({
        contacts: state.contacts.filter((c) => c.id !== id),
      })),
      bulkAddContacts: (contactsData) => {
        const newContacts = contactsData.map((c) => ({
          ...c,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        set((state) => ({ contacts: [...state.contacts, ...newContacts] }));
        return newContacts;
      },
      
      // ===== INTERESTED PARTIES =====
      interestedParties: [],
      addInterestedParty: (partyData) => {
        const newParty: InterestedParty = {
          ...partyData,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ interestedParties: [...state.interestedParties, newParty] }));
        return newParty;
      },
      updateInterestedParty: (id, partyData) => set((state) => ({
        interestedParties: state.interestedParties.map((p) =>
          p.id === id ? { ...p, ...partyData, updatedAt: new Date() } : p
        ),
      })),
      deleteInterestedParty: (id) => set((state) => ({
        interestedParties: state.interestedParties.filter((p) => p.id !== id),
      })),
      bulkAddInterestedParties: (partiesData) => {
        const newParties = partiesData.map((p) => ({
          ...p,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        set((state) => ({ interestedParties: [...state.interestedParties, ...newParties] }));
        return newParties;
      },
      
      // ===== AGREEMENTS =====
      agreements: [],
      addAgreement: (agreementData) => {
        const newAgreement: Agreement = {
          ...agreementData,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ agreements: [...state.agreements, newAgreement] }));
        return newAgreement;
      },
      updateAgreement: (id, agreementData) => set((state) => ({
        agreements: state.agreements.map((a) =>
          a.id === id ? { ...a, ...agreementData, updatedAt: new Date() } : a
        ),
      })),
      deleteAgreement: (id) => set((state) => ({
        agreements: state.agreements.filter((a) => a.id !== id),
      })),
      bulkAddAgreements: (agreementsData) => {
        const newAgreements = agreementsData.map((a) => ({
          ...a,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        set((state) => ({ agreements: [...state.agreements, ...newAgreements] }));
        return newAgreements;
      },
      
      // ===== AGREEMENT PARTIES =====
      agreementParties: [],
      addAgreementParty: (partyData) => {
        const newParty: AgreementParty = {
          ...partyData,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ agreementParties: [...state.agreementParties, newParty] }));
        return newParty;
      },
      updateAgreementParty: (id, partyData) => set((state) => ({
        agreementParties: state.agreementParties.map((p) =>
          p.id === id ? { ...p, ...partyData, updatedAt: new Date() } : p
        ),
      })),
      deleteAgreementParty: (id) => set((state) => ({
        agreementParties: state.agreementParties.filter((p) => p.id !== id),
      })),
      bulkAddAgreementParties: (partiesData) => {
        const newParties = partiesData.map((p) => ({
          ...p,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        set((state) => ({ agreementParties: [...state.agreementParties, ...newParties] }));
        return newParties;
      },
      
      // ===== AGREEMENT TERRITORIES =====
      agreementTerritories: [],
      addAgreementTerritory: (territoryData) => {
        const newTerritory: AgreementTerritory = {
          ...territoryData,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ agreementTerritories: [...state.agreementTerritories, newTerritory] }));
        return newTerritory;
      },
      updateAgreementTerritory: (id, territoryData) => set((state) => ({
        agreementTerritories: state.agreementTerritories.map((t) =>
          t.id === id ? { ...t, ...territoryData, updatedAt: new Date() } : t
        ),
      })),
      deleteAgreementTerritory: (id) => set((state) => ({
        agreementTerritories: state.agreementTerritories.filter((t) => t.id !== id),
      })),
      bulkAddAgreementTerritories: (territoriesData) => {
        const newTerritories = territoriesData.map((t) => ({
          ...t,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        set((state) => ({ agreementTerritories: [...state.agreementTerritories, ...newTerritories] }));
        return newTerritories;
      },
      
      // ===== MASTER OWNERSHIPS =====
      masterOwnerships: [],
      addMasterOwnership: (ownershipData) => {
        const newOwnership: MasterOwnership = {
          ...ownershipData,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ masterOwnerships: [...state.masterOwnerships, newOwnership] }));
        return newOwnership;
      },
      updateMasterOwnership: (id, ownershipData) => set((state) => ({
        masterOwnerships: state.masterOwnerships.map((o) =>
          o.id === id ? { ...o, ...ownershipData, updatedAt: new Date() } : o
        ),
      })),
      deleteMasterOwnership: (id) => set((state) => ({
        masterOwnerships: state.masterOwnerships.filter((o) => o.id !== id),
      })),
      bulkAddMasterOwnerships: (ownershipsData) => {
        const newOwnerships = ownershipsData.map((o) => ({
          ...o,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        set((state) => ({ masterOwnerships: [...state.masterOwnerships, ...newOwnerships] }));
        return newOwnerships;
      },
      
      // ===== ARTIST SHARES =====
      artistShares: [],
      addArtistShare: (shareData) => {
        const newShare: ArtistShare = {
          ...shareData,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ artistShares: [...state.artistShares, newShare] }));
        return newShare;
      },
      updateArtistShare: (id, shareData) => set((state) => ({
        artistShares: state.artistShares.map((s) =>
          s.id === id ? { ...s, ...shareData, updatedAt: new Date() } : s
        ),
      })),
      deleteArtistShare: (id) => set((state) => ({
        artistShares: state.artistShares.filter((s) => s.id !== id),
      })),
      bulkAddArtistShares: (sharesData) => {
        const newShares = sharesData.map((s) => ({
          ...s,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        set((state) => ({ artistShares: [...state.artistShares, ...newShares] }));
        return newShares;
      },
      
      // ===== VIDEOS =====
      videos: [],
      addVideo: (videoData) => {
        const newVideo: Video = {
          ...videoData,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ videos: [...state.videos, newVideo] }));
        return newVideo;
      },
      updateVideo: (id, videoData) => set((state) => ({
        videos: state.videos.map((v) =>
          v.id === id ? { ...v, ...videoData, updatedAt: new Date() } : v
        ),
      })),
      deleteVideo: (id) => set((state) => ({
        videos: state.videos.filter((v) => v.id !== id),
      })),
      bulkAddVideos: (videosData) => {
        const newVideos = videosData.map((v) => ({
          ...v,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        set((state) => ({ videos: [...state.videos, ...newVideos] }));
        return newVideos;
      },
      
      // ===== WRITER TERRITORIES =====
      writerTerritories: [],
      addWriterTerritory: (territoryData) => {
        const newTerritory: WriterTerritory = {
          ...territoryData,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ writerTerritories: [...state.writerTerritories, newTerritory] }));
        return newTerritory;
      },
      updateWriterTerritory: (id, territoryData) => set((state) => ({
        writerTerritories: state.writerTerritories.map((t) =>
          t.id === id ? { ...t, ...territoryData, updatedAt: new Date() } : t
        ),
      })),
      deleteWriterTerritory: (id) => set((state) => ({
        writerTerritories: state.writerTerritories.filter((t) => t.id !== id),
      })),
      bulkAddWriterTerritories: (territoriesData) => {
        const newTerritories = territoriesData.map((t) => ({
          ...t,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        set((state) => ({ writerTerritories: [...state.writerTerritories, ...newTerritories] }));
        return newTerritories;
      },
      
      // ===== PUBLISHER TERRITORIES =====
      publisherTerritories: [],
      addPublisherTerritory: (territoryData) => {
        const newTerritory: PublisherTerritory = {
          ...territoryData,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ publisherTerritories: [...state.publisherTerritories, newTerritory] }));
        return newTerritory;
      },
      updatePublisherTerritory: (id, territoryData) => set((state) => ({
        publisherTerritories: state.publisherTerritories.map((t) =>
          t.id === id ? { ...t, ...territoryData, updatedAt: new Date() } : t
        ),
      })),
      deletePublisherTerritory: (id) => set((state) => ({
        publisherTerritories: state.publisherTerritories.filter((t) => t.id !== id),
      })),
      bulkAddPublisherTerritories: (territoriesData) => {
        const newTerritories = territoriesData.map((t) => ({
          ...t,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        set((state) => ({ publisherTerritories: [...state.publisherTerritories, ...newTerritories] }));
        return newTerritories;
      },
      
      // ===== USER SETTINGS =====
      userSettings: null,
      updateUserSettings: (settings) => set((state) => ({
        userSettings: state.userSettings 
          ? { ...state.userSettings, ...settings }
          : { id: uuidv4(), firstName: '', lastName: '', roles: [], ...settings },
      })),
      
      // ===== CWR EXPORTS =====
      cwrExports: [],
      addCWRExport: (exportData) => {
        const newExport: CWRExport = {
          ...exportData,
          id: uuidv4(),
          createdAt: new Date(),
        };
        set((state) => ({ cwrExports: [...state.cwrExports, newExport] }));
        return newExport;
      },
      updateCWRExport: (id, exportData) => set((state) => ({
        cwrExports: state.cwrExports.map((e) =>
          e.id === id ? { ...e, ...exportData } : e
        ),
      })),
      
      // ===== ROYALTY STATEMENTS =====
      royaltyStatements: [],
      addRoyaltyStatement: (statementData) => {
        const newStatement: RoyaltyStatement = {
          ...statementData,
          id: uuidv4(),
          importedAt: new Date(),
        };
        set((state) => ({ royaltyStatements: [...state.royaltyStatements, newStatement] }));
        return newStatement;
      },
      
      // ===== CLEAR DATA =====
      clearAllData: () => set({
        works: [],
        writers: [],
        recordings: [],
        artists: [],
        publishers: [],
        labels: [],
        releases: [],
        contacts: [],
        interestedParties: [],
        agreements: [],
        agreementParties: [],
        agreementTerritories: [],
        masterOwnerships: [],
        artistShares: [],
        videos: [],
        writerTerritories: [],
        publisherTerritories: [],
        cwrExports: [],
        royaltyStatements: [],
        selectedWorkIds: [],
        workFilters: {},
      }),
      
      clearEntityData: (entityType: string) => {
        const clearMap: Record<string, () => void> = {
          works: () => set({ works: [] }),
          writers: () => set({ writers: [] }),
          publishers: () => set({ publishers: [] }),
          artists: () => set({ artists: [] }),
          labels: () => set({ labels: [] }),
          recordings: () => set({ recordings: [] }),
          releases: () => set({ releases: [] }),
          contacts: () => set({ contacts: [] }),
          interestedParties: () => set({ interestedParties: [] }),
          agreements: () => set({ agreements: [] }),
          agreementParties: () => set({ agreementParties: [] }),
          agreementTerritories: () => set({ agreementTerritories: [] }),
          masterOwnerships: () => set({ masterOwnerships: [] }),
          artistShares: () => set({ artistShares: [] }),
          videos: () => set({ videos: [] }),
          writerTerritories: () => set({ writerTerritories: [] }),
          publisherTerritories: () => set({ publisherTerritories: [] }),
        };
        clearMap[entityType]?.();
      },
      
      // ===== SELECTION =====
      selectedWorkIds: [],
      toggleWorkSelection: (id) => set((state) => ({
        selectedWorkIds: state.selectedWorkIds.includes(id)
          ? state.selectedWorkIds.filter((wid) => wid !== id)
          : [...state.selectedWorkIds, id],
      })),
      selectAllWorks: (ids) => set({ selectedWorkIds: ids }),
      clearWorkSelection: () => set({ selectedWorkIds: [] }),
      
      // ===== FILTERS =====
      workFilters: {},
      setWorkFilters: (filters) => set((state) => ({
        workFilters: { ...state.workFilters, ...filters },
      })),
      clearWorkFilters: () => set({ workFilters: {} }),
      
      // ===== COMPUTED =====
      getFilteredWorks: () => {
        const { works, workFilters } = get();
        let filtered = [...works];
        
        if (workFilters.search) {
          const search = workFilters.search.toLowerCase();
          filtered = filtered.filter(
            (w) =>
              w.title.toLowerCase().includes(search) ||
              w.workId.toLowerCase().includes(search) ||
              w.iswc?.toLowerCase().includes(search)
          );
        }
        
        if (workFilters.status) {
          filtered = filtered.filter((w) => w.status === workFilters.status);
        }
        
        if (workFilters.versionType) {
          filtered = filtered.filter((w) => w.versionType === workFilters.versionType);
        }
        
        if (workFilters.writerId) {
          filtered = filtered.filter((w) =>
            (w.writerShares || []).some((ws) => ws.writerId === workFilters.writerId)
          );
        }
        
        if (workFilters.hasIswc !== undefined) {
          filtered = filtered.filter((w) =>
            workFilters.hasIswc ? !!w.iswc : !w.iswc
          );
        }
        
        return filtered.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      },
      
      getDashboardStats: () => {
        const { 
          works, writers, recordings, artists, labels, publishers,
          agreements, contacts, interestedParties, royaltyStatements 
        } = get();
        
        const totalRoyalties = royaltyStatements.reduce(
          (sum, s) => sum + s.totalGross,
          0
        );
        const pendingRegistrations = works.filter(
          (w) => w.status === 'pending'
        ).length;
        const registeredWorks = works.filter(
          (w) => w.status === 'registered'
        ).length;
        const draftWorks = works.filter((w) => w.status === 'draft').length;
        
        return {
          totalWorks: works.length,
          totalWriters: writers.length,
          totalRecordings: recordings.length,
          totalArtists: artists.length,
          totalLabels: labels.length,
          totalPublishers: publishers.length,
          totalAgreements: agreements.length,
          totalContacts: contacts.length,
          totalInterestedParties: interestedParties.length,
          pendingRegistrations,
          totalRoyalties,
          registeredWorks,
          draftWorks,
        };
      },
      
      // ===== LOOKUP HELPERS =====
      getWriterById: (id) => get().writers.find((w) => w.id === id),
      getPublisherById: (id) => get().publishers.find((p) => p.id === id),
      getArtistById: (id) => get().artists.find((a) => a.id === id),
      getLabelById: (id) => get().labels.find((l) => l.id === id),
      getAgreementById: (id) => get().agreements.find((a) => a.id === id),
      getContactById: (id) => get().contacts.find((c) => c.id === id),
      getInterestedPartyById: (id) => get().interestedParties.find((p) => p.id === id),
      
      // Lookup by custom ID (e.g., "RWRI10001")
      getWriterByWriterId: (writerId) => get().writers.find((w) => w.writerId === writerId),
      getPublisherByPublisherId: (publisherId) => get().publishers.find((p) => p.publisherId === publisherId),
      getArtistByArtistId: (artistId) => get().artists.find((a) => a.artistId === artistId),
      getLabelByLabelId: (labelId) => get().labels.find((l) => l.labelId === labelId),
      getAgreementByAgreementId: (agreementId) => get().agreements.find((a) => a.agreementId === agreementId),
      getContactByContactId: (contactId) => get().contacts.find((c) => c.contactId === contactId),
      getInterestedPartyByPartyId: (partyId) => get().interestedParties.find((p) => p.interestedPartyId === partyId),
    }),
    {
      name: 'music-publisher-storage',
      // Custom serialization to avoid cyclic structures
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          // Remove circular references before storing
          const sanitize = (obj: any): any => {
            if (obj === null || obj === undefined) return obj;
            if (typeof obj !== 'object') return obj;
            if (obj instanceof Date) return obj.toISOString();
            if (Array.isArray(obj)) return obj.map(sanitize);
            
            const cleaned: any = {};
            for (const key of Object.keys(obj)) {
              // Skip nested object references that cause cycles
              if (['writer', 'publisher', 'artist', 'label', 'agreement', 'work', 
                   'parentLabel', 'parentPublisher', 'prAffiliation', 'mrAffiliation',
                   'srAffiliation', 'recordings', 'artists'].includes(key)) {
                continue;
              }
              cleaned[key] = sanitize(obj[key]);
            }
            return cleaned;
          };
          
          const sanitized = {
            ...value,
            state: sanitize(value.state)
          };
          localStorage.setItem(name, JSON.stringify(sanitized));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
      partialize: (state): any => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        publisherSettings: state.publisherSettings,
        userSettings: state.userSettings,
        works: state.works,
        writers: state.writers,
        publishers: state.publishers,
        artists: state.artists,
        labels: state.labels,
        recordings: state.recordings,
        releases: state.releases,
        contacts: state.contacts,
        interestedParties: state.interestedParties,
        agreements: state.agreements,
        agreementParties: state.agreementParties,
        agreementTerritories: state.agreementTerritories,
        masterOwnerships: state.masterOwnerships,
        artistShares: state.artistShares,
        videos: state.videos,
        writerTerritories: state.writerTerritories,
        publisherTerritories: state.publisherTerritories,
        royaltyStatements: state.royaltyStatements,
        cwrExports: state.cwrExports,
      }),
    }
  )
);
