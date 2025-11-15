import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement> & {
    size?: number | string;
};

export const HomeIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
    <svg role="img" height={size} width={size} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);

export const HomeActiveIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
    <svg role="img" height={size} width={size} aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12.5 1.167a2.5 2.5 0 0 0-1 0L2.941 5.05C1.72 5.614.933 6.945.933 8.368V20.5a2.5 2.5 0 0 0 2.5 2.5h17a2.5 2.5 0 0 0 2.5-2.5V8.368c0-1.423-.786-2.754-2.008-3.318L12.5 1.167zM12 3.203l8.567 3.894-3.55 1.614-8.567-3.894L12 3.203zm-1 15.73V12.07l-6.067 2.757v3.348a.5.5 0 0 0 .5.5H11zm2 0h5.567a.5.5 0 0 0 .5-.5v-3.348l-6.067-2.757V18.933z"></path></svg>
);

export const LibraryIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
    <svg role="img" height={size} width={size} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>
);

export const LibraryActiveIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
     <svg role="img" height={size} width={size} aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0h16a1 1 0 1 1 0 2H5v15a1 1 0 0 1-1 1H3zm2-3a1 1 0 0 1-1-1V5a1 1 0 1 1 2 0v13a1 1 0 0 1-1 1zm4 1a1 1 0 0 1-1-1V4a1 1 0 0 1 2 0v15a1 1 0 0 1-1 1zm4 0a1 1 0 0 1-1-1V4a1 1 0 1 1 2 0v15a1 1 0 0 1-1 1zm4 0a1 1 0 0 1-1-1V4a1 1 0 1 1 2 0v15a1 1 0 0 1-1 1z"></path></svg>
);


export const PlusIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
    <svg role="img" height={size} width={size} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);

export const HeartIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
    <svg role="img" height={size} width={size} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
);

export const PlayIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
    <svg role="img" height={size} width={size} aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="5 3 19 12 5 21 5 3"/></svg>
);

export const PauseIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
    <svg role="img" height={size} width={size} aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
);

export const SkipBackIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
    <svg role="img" height={size} width={size} aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>
);

export const SkipForwardIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
    <svg role="img" height={size} width={size} aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>
);

export const ShuffleIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
    <svg role="img" height={size} width={size} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 18h1.4c1.3 0 2.5-.6 3.4-1.6l1.8-2.1c.8-1 2-1.6 3.3-1.6h2.1c1.3 0 2.5.6 3.4 1.6l1.8 2.1c.9 1 2.1 1.6 3.4 1.6H22"/><path d="m18 6 4 4-4 4"/><path d="m6 6-4 4 4 4"/><path d="M2 6h1.4c1.3 0 2.5.6 3.4 1.6l1.8 2.1c.9 1 2.1 1.6 3.4 1.6h2.1c1.3 0 2.5-.6 3.4-1.6l1.8-2.1c.9-1 2.1-1.6 3.4-1.6H22"/></svg>
);

export const RepeatIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
    <svg role="img" height={size} width={size} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>
);

export const Repeat1Icon: React.FC<IconProps> = ({ size = 24, ...props }) => (
    <svg role="img" height={size} width={size} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/><path d="M11 10h1v4"/></svg>
);

export const Volume1Icon: React.FC<IconProps> = ({ size = 24, ...props }) => (
    <svg role="img" height={size} width={size} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
);

export const Volume2Icon: React.FC<IconProps> = ({ size = 24, ...props }) => (
    <svg role="img" height={size} width={size} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
);

export const VolumeXIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
    <svg role="img" height={size} width={size} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>
);

export const MusicIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
    <svg role="img" height={size} width={size} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
);

export const MicIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
    <svg role="img" height={size} width={size} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
);

export const SearchIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
    <svg role="img" height={size} width={size} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

export const ChevronLeft: React.FC<IconProps> = ({ size = 24, ...props }) => (
    <svg role="img" height={size} width={size} aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>
);

export const ChevronRight: React.FC<IconProps> = ({ size = 24, ...props }) => (
    <svg role="img" height={size} width={size} aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg>
);

export const PinIcon: React.FC<IconProps> = ({ size = 16, ...props }) => (
    <svg role="img" height={size} width={size} aria-hidden="true" viewBox="0 0 16 16" fill="currentColor" {...props}><path d="M4.75 2.5a.75.75 0 0 1 .75.75V7h7V3.25a.75.75 0 0 1 1.5 0V7h.25a.75.75 0 0 1 0 1.5H14v.25a.75.75 0 0 1-1.5 0V8.5h-7v3.75a.75.75 0 0 1-1.5 0V8.5H3v-.25a.75.75 0 0 1 1.5 0V7h.25V3.25a.75.75 0 0 1 .75-.75zM8.5 7V2.5H8v11l-1.42-1.42a.75.75 0 0 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0l2.5-2.5a.75.75 0 0 0-1.06-1.06L8.5 13.06V7z"></path></svg>
);

export const QueueIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
    <svg role="img" height={size} width={size} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="21" x2="3" y1="6" y2="6"/><line x1="21" x2="3" y1="12" y2="12"/><line x1="15" x2="3" y1="18" y2="18"/></svg>
);

export const MoreHorizontalIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
    <svg role="img" height={size} width={size} aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" {...props}><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="5" cy="12" r="2"/></svg>
);

export const XIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
    <svg role="img" height={size} width={size} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export const UploadCloudIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
    <svg role="img" height={size} width={size} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
        <path d="M12 12v9" />
        <path d="m16 16-4-4-4 4" />
    </svg>
);