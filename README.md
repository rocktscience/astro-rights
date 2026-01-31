# 🚀 Rocket Science Music Publisher

A modern, full-featured music publishing and royalty management platform with comprehensive CWR (Common Works Registration) support. Built with Next.js 14, React 18, TypeScript, and Tailwind CSS.

![Dashboard Preview](https://img.shields.io/badge/Status-Production_Ready-success)
![CWR Support](https://img.shields.io/badge/CWR-2.1%20|%202.2%20|%203.0%20|%203.1-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 📚 Catalog Management
- **Musical Works** - Full CRUD with search, filters, batch selection
- **Writers** - Controlled vs uncontrolled designation, IPI tracking, PRO affiliations
- **Publishers** - Original, Administrator, Sub-Publisher roles with territory management
- **Recordings** - ISRC management, artist/label linking, duration tracking
- **Artists** - ISNI support, performer management
- **Labels** - Label codes, imprint hierarchy
- **Releases** - Albums, singles, EPs with UPC tracking

### 📝 CWR Generation
- **Full CWR 2.1/2.2/3.0/3.1 Support** - Complete CISAC specification compliance
- **NWR & REV Transactions** - New Work Registration and Revision support
- **All Record Types** - HDR, GRH, NWR/REV, SPU, SPT, SWR, SWT, OWR, PWR, ALT, PER, REC, GRT, TRL
- **Syntax Highlighting** - Color-coded preview of CWR files
- **Download & FTP** - Direct download or send via FTP to societies
- **ACK File Parsing** - Import acknowledgements, update registration status

### 💰 Royalty Management
- **Statement Import** - CSV parsing with configurable column mapping
- **Work Matching** - Automatic matching by ISWC, title, or alternate titles
- **Writer Distribution** - Calculate shares based on ownership percentages
- **Publisher Fees** - Per-writer or default fee deductions
- **Distribution Reports** - Export CSV reports for writer payments
- **Interactive Charts** - Visualize royalties by source, period, and work

### 🎨 Modern UI/UX
- **Glass Morphism** - Backdrop blur effects and transparency
- **Day/Night Theme** - Toggle between light and dark modes
- **Smooth Animations** - Framer Motion powered transitions
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Collapsible Sidebar** - Maximize workspace when needed
- **Toast Notifications** - Real-time feedback for all actions

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persistence
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd music-publisher-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Dashboard
│   ├── works/             # Works management
│   ├── writers/           # Writers management
│   ├── recordings/        # Recordings management
│   ├── artists/           # Artists management
│   ├── publishers/        # Publishers management
│   ├── labels/            # Labels management
│   ├── releases/          # Releases management
│   ├── cwr/               # CWR exports & ACK imports
│   ├── royalties/         # Royalty statements & distribution
│   ├── import/            # Bulk data import
│   └── settings/          # Publisher configuration
├── components/
│   ├── layout/            # Sidebar, navigation
│   └── ui/                # Reusable UI components
├── lib/
│   ├── cwr-generator.ts   # Full CWR generation engine
│   ├── royalty-calculator.ts # Royalty distribution logic
│   └── utils.ts           # Utility functions
├── store/
│   └── index.ts           # Zustand store with sample data
└── types/
    └── index.ts           # TypeScript type definitions
```

## 🎯 Key Pages

### Dashboard
- Real-time statistics overview
- Registration status breakdown (pie chart)
- Royalty trends (area chart)
- Recent works and CWR exports

### Works
- Searchable, filterable table
- Multi-select for batch operations
- Tabbed detail view (Writers, Publishers, Recordings, Registrations, Alternate Titles)
- One-click CWR generation

### CWR Exports
- All generated files with status tracking
- Syntax-highlighted preview
- Download or mark as sent
- ACK file import for status updates

### Royalties
- Import CSV statements from any society
- Automatic work matching
- Writer distribution calculations
- Export distribution CSV reports

### Settings
- Publisher name, IPI, delivery code
- Society affiliations (PRO/MRO/SRO)
- Default fee percentages
- FTP configuration for automated delivery

## 🔧 Configuration

### Publisher Settings
Configure your publishing company in Settings:

- **Publisher Name** - Your company name
- **IPI Name Number** - 11-digit IPI from your society
- **CWR Delivery Code** - 3-character code from your society
- **PRO Affiliation** - ASCAP, BMI, SESAC, PRS, GEMA, etc.
- **MRO Affiliation** - The MLC, CMRRA, MCPS, etc.

### CWR Generation
Select works and choose:
- CWR Version (2.1, 2.2, 3.0, 3.1)
- Transaction Type (NWR for new, REV for revisions)
- Recipient Society

## 📊 Sample Data

The app comes pre-loaded with sample data including:
- 5 reggaeton/Latin urban musical works
- 4 songwriters (3 controlled, 1 uncontrolled)
- 3 recordings with ISRC codes
- 3 artists
- 2 record labels
- 2 royalty statements with line items
- 2 CWR exports

## 🔐 Data Persistence

All data is stored in browser localStorage via Zustand persist middleware. Data persists across sessions but is specific to the browser.

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Other Platforms
The app is a standard Next.js application and can be deployed to any platform that supports Node.js.

## 📚 CWR Specification Reference

This implementation follows the CISAC Common Works Registration standard:

- [CWR 2.1 Specification](https://members.cisac.org/CisacPortal/cisacDownloadFile.do?docId=37079)
- [CWR User Manual](https://musicmark.com/documents/cwr11-1494_cwr_user_manual_2011-09-23_e_2011-09-23_en.pdf)

### Supported Record Types

| Record | Description |
|--------|-------------|
| HDR | File Header |
| GRH | Group Header |
| NWR | New Work Registration |
| REV | Revised Registration |
| SPU | Publisher Controlled |
| SPT | Publisher Territory |
| SWR | Writer Controlled |
| SWT | Writer Territory |
| OWR | Other Writer (Uncontrolled) |
| PWR | Publisher for Writer |
| ALT | Alternate Title |
| PER | Performing Artist (CWR 3.0+) |
| REC | Recording (CWR 3.0+) |
| GRT | Group Trailer |
| TRL | File Trailer |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- [Django Music Publisher](https://github.com/matijakolaric-com/django-music-publisher) - Inspiration for CWR implementation
- [CISAC](https://www.cisac.org) - CWR specification
- [Tailwind CSS](https://tailwindcss.com) - Styling framework
- [Lucide](https://lucide.dev) - Beautiful icons

---

Built with ❤️ for music publishers worldwide
