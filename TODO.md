# LOEMS Rebranding Project - TODO

## Overview
Rebrand the BhoomiGraph platform to LOEMS (Land • Output • Earnings • Market • Support) - Digital Infrastructure Platform for Agriculture.

## Priority 1: Critical Branding Updates

- [x] 1.1 Update `frontend/index.html` - Title, metadata, and SEO
- [x] 1.2 Update `frontend/src/components/Navbar.tsx` - Logo "BhoomiGraph" → "LOEMS"
- [x] 1.3 Update `frontend/src/components/HeroSection.tsx` - New heading, subheading, CTA
- [x] 1.4 Update `frontend/src/components/Footer.tsx` - Logo and footer branding
- [x] 1.5 Update `frontend/src/pages/Auth.tsx` - Logo on auth page

## Priority 2: Landing Page Restructuring

- [x] 2.1 Update `frontend/src/components/PlatformSection.tsx` - LOEMS architecture with 5 pillars:
  - Digital Farm Infrastructure (LAND)
  - Intelligent Farm Operations (OUTPUT)
  - Farm Economics & Earnings (EARNINGS)
  - Connected Agricultural Markets (MARKET)
  - Ecosystem Support & Services (SUPPORT)

- [x] 2.2 Update `frontend/src/components/AboutSection.tsx` - Company story to LOEMS
- [x] 2.3 Update `frontend/src/components/ContactSection.tsx` - Company references

## Priority 3: Supporting Section Updates

- [x] 3.1 Update `frontend/src/components/CoreFocusSection.tsx` - Section heading
- [x] 3.2 Update `frontend/src/components/WhyChooseSection.tsx` - Brand name
- [x] 3.3 Update `frontend/src/components/IndustriesSection.tsx` - Updated to "Who We Serve" with 4 stakeholders:
  - Farmers & FPOs
  - Banks & Insurance
  - Government Agencies
  - Buyers & Exporters
- [x] 3.4 Update `frontend/src/components/ImpactSection.tsx` - Minor text updates (not needed)

## Priority 4: Dashboard Modules (Keep Functional)

- [x] 4.1 Update `frontend/src/modules/farmer/FarmerLayout.tsx` - Sidebar logo
- [ ] 4.2 Update `frontend/src/modules/agronomist/pages/CreateAdvisory.tsx` - Telemetry reference (SKIP - internal module)
- [ ] 4.3 Update `frontend/src/pages/Payments.tsx` - Wallet name (SKIP - internal module)

## Priority 5: Testing & Verification

- [ ] 5.1 Verify all pages load correctly
- [ ] 5.2 Verify routing works (Dashboard navigation)
- [ ] 5.3 Verify auth flow works

## COMPLETED CHANGES

### ✅ New Branding:
- "BhoomiGraph" → "LOEMS"
- Tagline: "Digital Infrastructure Platform for Agriculture"

### ✅ New Hero Section:
- Heading: "Building the Digital Infrastructure for Modern Agriculture"
- Subheading: "From verified land to intelligent farm operations and trusted market access, LOEMS transforms farms into digital, finance-ready assets."
- CTAs: "Explore Platform" and "Partner With Us"

### ✅ Platform Architecture (5 Pillars):
1. LAND - Digital Farm Infrastructure
2. OUTPUT - Intelligent Farm Operations
3. EARNINGS - Farm Economics & Financial Intelligence
4. MARKET - Connected Agricultural Marketplace
5. SUPPORT - Ecosystem Support & Services

### ✅ Who We Serve Section:
- Farmers & FPOs
- Banks & Insurance
- Government Agencies
- Buyers & Exporters

### ✅ DO NOT MODIFY (Kept as-is):
- All dashboard functionality (Farmer, Pilot, Agronomist, Admin)
- Backend APIs and database models
- Authentication system
- Internal module references in dashboard pages

