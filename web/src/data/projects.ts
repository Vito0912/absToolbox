import type { Project, TagDefinition } from '@/types/project';

export const projects: Project[] = [
  {
    id: 'complete-your-collection',
    name: 'Complete Your Collection',
    link: 'https://github.com/xFrieDSpuDx/completeseries',
    description: 'Find audiobooks missing from a series you own.',
    authors: ['xFrieDSpuDx'],
    authorLinks: ['https://github.com/xFrieDSpuDx'],
    tags: ['utility', 'abs-native']
  },
  {
    id: 'abs-opds',
    name: 'OPDS',
    link: 'https://github.com/Vito0912/abs-opds',
    description: 'OPDS-Server for Audiobookshelf',
    authors: ['Vito0912'],
    authorLinks: ['https://github.com/Vito0912'],
    tags: ['server', 'integration']
  },
  {
    id: 'abs-autoconverter',
    name: 'Autoconverter',
    link: 'https://github.com/Vito0912/abs-autoconverter',
    description: 'This tool automatically converts (and queues) all current and upcoming items in your library to specified codecs using the built-in converter',
    authors: ['Vito0912'],
    authorLinks: ['https://github.com/Vito0912'],
    tags: ['utility', 'automation', 'abs-native']
  },
  {
    id: 'audiobookshelf-sonos',
    name: 'Sonos',
    link: 'https://github.com/jmt-gh/audiobookshelf-sonos',
    description: 'Play your audiobooks from Audiobookshelf on your Sonos speakers',
    authors: ['jmt-gh'],
    authorLinks: ['https://github.com/jmt-gh'],
    tags: ['integration', 'abs-native']
  },
  {
    id: 'abs-alexa',
    name: 'Alexa',
    link: 'https://github.com/sevenlayercookie/abs-alexa',
    description: 'Alexa Skill for interfacing with Audiobookshelf',
    authors: ['sevenlayercookie'],
    authorLinks: ['https://github.com/sevenlayercookie'],
    tags: ['integration', 'abs-native']
  },
  {
    id: 'audiobook-organizer',
    name: 'Audiobook Organizer',
    link: 'https://github.com/jeeftor/audiobook-organizer',
    description: 'Audiobookshelf Organizer ',
    authors: ['jeeftor'],
    authorLinks: ['https://github.com/jeeftor'],
    tags: ['utility', 'automation']
  },
    {
    id: 'ab_mover',
    name: 'ab_mover',
    link: 'https://github.com/austinsr1/ab_mover',
    description: 'Command line utility to read an Audiobookshelf metadata.json file and create a directory structure based on it.',
    authors: ['austinsr1'],
    authorLinks: ['https://github.com/austinsr1'],
    tags: ['utility']
  },
  {
    id: 'bookshelf-traveller',
    name: 'Bookshelf Traveller',
    link: 'https://github.com/donkevlar/Bookshelf-Traveller',
    description: 'Fully featured self-hosted audiobookshelf discord bot. ',
    authors: ['donkevlar'],
    authorLinks: ['https://github.com/donkevlar'],
    tags: ['utility', 'abs-native']
  },
  {
    id: 'hass-audiobookshelf',
    name: 'Hass Audiobookshelf',
    link: 'https://github.com/wolffshots/hass-audiobookshelf',
    description: 'Adds sensors for an Audiobookshelf server to Home Assistant to show connection and active sessions.',
    authors: ['wolffshots'],
    authorLinks: ['https://github.com/wolffshots'],
    tags: ['integration', 'abs-native']
  },
  {
    id: 'audiobookshelf-hardcover-sync',
    name: 'Hardcover Sync',
    link: 'https://github.com/drallgood/audiobookshelf-hardcover-sync',
    description: 'Syncs Audiobookshelf to Hardcover ',
    authors: ['drallgood'],
    authorLinks: ['https://github.com/drallgood'],
    tags: ['integration', 'abs-native']
  },
  {
    id: 'shelfbridge',
    name: 'ShelfBridge',
    link: 'https://github.com/rohit-purandare/ShelfBridge',
    description: 'Sync your audiobook reading progress from Audiobookshelf to Hardcover automatically ',
    authors: ['rohit-purandare'],
    authorLinks: ['https://github.com/rohit-purandare'],
    tags: ['integration', 'abs-native']
  },
 {
    id: 'audiobookshelf-calibre-plugin',
    name: 'Audiobookshelf Calibre Plugin',
    link: 'https://github.com/jbhul/Audiobookshelf-calibre-plugin',
    description: 'A calibre plugin to synchronize metadata from Audiobookshelf to calibre ',
    authors: ['jbhul'],
    authorLinks: ['https://github.com/jbhul'],
    tags: ['integration', 'abs-native']
  },
   {
    id: 'audiobookrequest',
    name: 'Audiobook Request',
    link: 'https://github.com/markbeep/AudioBookRequest',
    description: 'Audiobook request management/wishlist for Plex/Audiobookshelf/Jellyfin ',
    authors: ['markbeep'],
    authorLinks: ['https://github.com/markbeep'],
    tags: ['abs-unspecific']
  },
     {
    id: 'achew',
    name: 'achew',
    link: 'https://github.com/SirGibblets/achew',
    description: 'Audiobook Chapter Extraction Wizard for Audiobookshelf',
    authors: ['SirGibblets'],
    authorLinks: ['https://github.com/SirGibblets'],
    tags: ['abs-unspecific']
  },
  {
    id: 'epub-to-audiobook',
    name: 'EPUB to Audiobook Converter',
    link: 'https://github.com/p0n1/epub_to_audiobook',
    description: 'EPUB to audiobook converter, optimized for Audiobookshelf, WebUI included',
    authors: ['p0n1'],
    authorLinks: ['https://github.com/p0n1'],
    tags: ['abs-unspecific']
  }
];

export const tagDefinitions: Record<string, TagDefinition> = {
  'abs-native': {
    name: 'ABS Native',
    description: 'Apps designed specifically for Audiobookshelf with direct integration'
  },
  'abs-unspecific': {
    name: 'ABS Unspecific',
    description: 'Apps that work with Audiobookshelf but are not specifically designed for it'
  },
  'utility': {
    name: 'Utility',
    description: 'Tools that help with library management and organization'
  },
  'server': {
    name: 'Server',
    description: 'Server-side applications and services'
  },
  'integration': {
    name: 'Integration',
    description: 'Apps that connect ABS with external services and protocols'
  },
  'automation': {
    name: 'Automation',
    description: 'Tools that automate repetitive tasks and workflows'
  },
  'client': {
    name: 'Client',
    description: 'Alternative client applications for accessing your library'
  },
  'mobile': {
    name: 'Mobile',
    description: 'Mobile applications and mobile-specific features'
  },
  'web': {
    name: 'Web',
    description: 'Web-based applications and browser extensions'
  }
};

export const availableTags = Object.keys(tagDefinitions);