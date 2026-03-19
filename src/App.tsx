import React, { useState, useEffect, useRef } from 'react';
import { 
  Monitor, 
  Keyboard, 
  FileText, 
  Globe, 
  ChevronRight, 
  CheckCircle2, 
  Lock, 
  User, 
  LogOut,
  CreditCard,
  Trophy,
  Search,
  Book,
  Zap,
  Cpu,
  Settings,
  HelpCircle,
  Download,
  Share2,
  Printer,
  MousePointer2,
  HardDrive,
  Shield,
  Copy,
  Table,
  FileCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  quiz?: QuizQuestion[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  lessons: Lesson[];
}

const COURSES: Course[] = [
  {
    id: 'intro',
    title: 'Introduction to Computers',
    description: 'Learn the basic components and how computers work.',
    icon: <Monitor className="w-6 h-6" />,
    category: 'Basics',
    lessons: [
      { id: 'intro-1', title: 'What is a Computer?', duration: '05:00', videoUrl: 'https://www.youtube.com/embed/7yC2pQ4pE9o', description: 'A computer is an electronic device that processes data and performs tasks according to instructions given by a user.' },
      { id: 'intro-2', title: 'Types of Computers', duration: '08:00', videoUrl: 'https://www.youtube.com/embed/7yC2pQ4pE9o', description: 'Learn about Desktop Computers, Laptops, Tablets, and Smartphones.' },
      { id: 'intro-3', title: 'Parts of a Computer', duration: '10:00', videoUrl: 'https://www.youtube.com/embed/7yC2pQ4pE9o', description: 'Understanding the Monitor, Keyboard, Mouse, CPU, and Printer.' },
      { id: 'intro-4', title: 'Watch Video Lesson', duration: '07:00', videoUrl: 'https://www.youtube.com/embed/7yC2pQ4pE9o', description: 'Watch this comprehensive video guide on computer basics.' },
      { id: 'intro-5', title: 'Quiz', duration: '12:00', videoUrl: 'https://www.youtube.com/embed/7yC2pQ4pE9o', description: 'Test your knowledge with a quick quiz.', quiz: [
        { question: "What is the brain of the computer?", options: ["Monitor", "CPU", "Keyboard", "Mouse"], correctAnswer: "CPU" },
        { question: "Which of these is an input device?", options: ["Printer", "Monitor", "Keyboard", "Speakers"], correctAnswer: "Keyboard" },
        { question: "What does RAM stand for?", options: ["Read Access Memory", "Random Access Memory", "Real Access Memory", "Rapid Access Memory"], correctAnswer: "Random Access Memory" }
      ] }
    ]
  },
  {
    id: 'typing',
    title: 'Keyboard Typing Training',
    description: 'Master touch typing and increase your words per minute.',
    icon: <Keyboard className="w-6 h-6" />,
    category: 'Skills',
    lessons: [
      { id: 'typing-1', title: 'The Home Row', duration: '06:00', videoUrl: 'https://www.youtube.com/embed/2F0t1rK0Y6Y', description: 'Mastering the starting position for your fingers.' },
      { id: 'typing-2', title: 'Top Row Keys', duration: '08:00', videoUrl: 'https://www.youtube.com/embed/2F0t1rK0Y6Y', description: 'Reaching for QWERTYUIOP without looking.' },
      { id: 'typing-3', title: 'Bottom Row Keys', duration: '08:00', videoUrl: 'https://www.youtube.com/embed/2F0t1rK0Y6Y', description: 'Mastering ZXCVBNM.' },
      { id: 'typing-4', title: 'Numbers & Symbols', duration: '10:00', videoUrl: 'https://www.youtube.com/embed/2F0t1rK0Y6Y', description: 'Using the shift key and top row numbers.' },
      { id: 'typing-5', title: 'Speed Building', duration: '15:00', videoUrl: 'https://www.youtube.com/embed/2F0t1rK0Y6Y', description: 'Techniques to increase your WPM.' }
    ]
  },
  {
    id: 'word',
    title: 'Microsoft Word Basics',
    description: 'Create professional documents and reports.',
    icon: <FileText className="w-6 h-6" />,
    category: 'Office',
    lessons: [
      { id: 'word-1', title: 'Creating a New Document', duration: '05:00', videoUrl: 'https://www.youtube.com/embed/o9ZyV7k2XQ8', description: 'Templates, blank documents, and saving files.' },
      { id: 'word-2', title: 'Text Formatting', duration: '10:00', videoUrl: 'https://www.youtube.com/embed/o9ZyV7k2XQ8', description: 'Fonts, sizes, colors, and styles.' },
      { id: 'word-3', title: 'Paragraph Alignment', duration: '07:00', videoUrl: 'https://www.youtube.com/embed/o9ZyV7k2XQ8', description: 'Left, right, center, and justified text.' },
      { id: 'word-4', title: 'Inserting Images', duration: '08:00', videoUrl: 'https://www.youtube.com/embed/o9ZyV7k2XQ8', description: 'Adding and positioning pictures in your document.' },
      { id: 'word-5', title: 'Printing & Exporting', duration: '06:00', videoUrl: 'https://www.youtube.com/embed/o9ZyV7k2XQ8', description: 'Preparing your document for the real world.' }
    ]
  },
  {
    id: 'internet',
    title: 'Internet & Email Basics',
    description: 'Stay safe online and master communication.',
    icon: <Globe className="w-6 h-6" />,
    category: 'Basics',
    lessons: [
      { id: 'net-1', title: 'How the Web Works', duration: '06:00', videoUrl: 'https://www.youtube.com/embed/u_K9oXv0M5k', description: 'Browsers, URLs, and servers explained.' },
      { id: 'net-2', title: 'Using Search Engines', duration: '08:00', videoUrl: 'https://www.youtube.com/embed/u_K9oXv0M5k', description: 'Tips for finding exactly what you need on Google.' },
      { id: 'net-3', title: 'Email Etiquette', duration: '07:00', videoUrl: 'https://www.youtube.com/embed/u_K9oXv0M5k', description: 'Writing professional and clear emails.' },
      { id: 'net-4', title: 'Online Safety', duration: '12:00', videoUrl: 'https://www.youtube.com/embed/u_K9oXv0M5k', description: 'Identifying phishing and protecting your passwords.' },
      { id: 'net-5', title: 'Social Media Basics', duration: '10:00', videoUrl: 'https://www.youtube.com/embed/u_K9oXv0M5k', description: 'Connecting with others safely.' }
    ]
  },
  {
    id: 'excel',
    title: 'Microsoft Excel for Beginners',
    description: 'Learn to organize, calculate, and analyze data with spreadsheets.',
    icon: <Monitor className="w-6 h-6" />,
    category: 'Office',
    lessons: [
      { id: 'excel-1', title: 'Introduction to Excel', duration: '10:00', videoUrl: 'https://www.youtube.com/embed/rwbho0CgEAE', description: 'Microsoft Excel is a spreadsheet program used to organize, calculate and analyze data.' },
      { id: 'excel-2', title: 'Excel Interface', duration: '08:00', videoUrl: 'https://www.youtube.com/embed/rwbho0CgEAE', description: 'Learn about Rows (1,2,3...), Columns (A,B,C...), Cells (A1, B2 etc), and Worksheets.' },
      { id: 'excel-3', title: 'Entering Data', duration: '10:00', videoUrl: 'https://www.youtube.com/embed/rwbho0CgEAE', description: 'Practice entering numbers in a spreadsheet grid.' },
      { id: 'excel-4', title: 'Excel Formulas', duration: '12:00', videoUrl: 'https://www.youtube.com/embed/rwbho0CgEAE', description: 'Learn basic formulas like =A1+B1, =SUM(A1:A5), and =AVERAGE(A1:A5).' },
      { id: 'excel-5', title: 'Practice Exercise', duration: '15:00', videoUrl: 'https://www.youtube.com/embed/rwbho0CgEAE', description: 'Test your skills by calculating totals automatically.' }
    ]
  },
  {
    id: 'windows',
    title: 'Windows Environment Training',
    description: 'Master the Windows operating system, from basic mouse skills to file management and utility programs.',
    icon: <Monitor className="w-6 h-6" />,
    category: 'Basics',
    lessons: [
      { id: 'win-1', title: 'Getting Started & Mouse Skills', duration: '10:00', videoUrl: 'https://www.youtube.com/embed/m66Z_vY5880', description: 'Learn what Windows is and how to use the mouse effectively for clicking, dragging, and scrolling.' },
      { id: 'win-2', title: 'Desktop & Personalization', duration: '12:00', videoUrl: 'https://www.youtube.com/embed/m66Z_vY5880', description: 'Explore the desktop, taskbar, and learn how to change your background and create shortcuts.' },
      { id: 'win-3', title: 'Files, Folders & File Explorer', duration: '15:00', videoUrl: 'https://www.youtube.com/embed/m66Z_vY5880', description: 'Master file management: creating folders, moving files, and using the Recycle Bin.' },
      { id: 'win-4', title: 'Utilities & External Devices', duration: '15:00', videoUrl: 'https://www.youtube.com/embed/m66Z_vY5880', description: 'Learn about Windows utilities like Paint and Snipping Tool, and how to use flash drives or transfer files from a phone.' },
      { id: 'win-5', title: 'Review & Assessment', duration: '10:00', videoUrl: 'https://www.youtube.com/embed/m66Z_vY5880', description: 'Watch the full tutorial and test your knowledge with a comprehensive quiz.', quiz: [
        { question: "Which shortcut opens File Explorer?", options: ["Win + E", "Win + D", "Win + L", "Ctrl + E"], correctAnswer: "Win + E" },
        { question: "What is the taskbar used for?", options: ["Typing text", "Switching between apps", "Printing files", "Changing volume only"], correctAnswer: "Switching between apps" },
        { question: "Where do deleted files go?", options: ["Hard Drive", "Recycle Bin", "Desktop", "Cloud"], correctAnswer: "Recycle Bin" }
      ] }
    ]
  },
  {
    id: 'hardware',
    title: 'Computer Hardware',
    description: 'Understand the physical components that make up a computer system.',
    icon: <Cpu className="w-6 h-6" />,
    category: 'Advanced',
    lessons: [
      { id: 'hw-1', title: 'Motherboard & CPU', duration: '12:00', videoUrl: 'https://www.youtube.com/embed/7yC2pQ4pE9o', description: 'The heart and brain of the computer.' },
      { id: 'hw-2', title: 'RAM & Storage', duration: '10:00', videoUrl: 'https://www.youtube.com/embed/7yC2pQ4pE9o', description: 'Understanding memory and hard drives.' },
      { id: 'hw-3', title: 'Power Supply & Cooling', duration: '08:00', videoUrl: 'https://www.youtube.com/embed/7yC2pQ4pE9o', description: 'Keeping your system running and cool.' },
      { id: 'hw-4', title: 'Input & Output Devices', duration: '07:00', videoUrl: 'https://www.youtube.com/embed/7yC2pQ4pE9o', description: 'Printers, scanners, and specialized hardware.' },
      { id: 'hw-5', title: 'Hardware Maintenance', duration: '15:00', videoUrl: 'https://www.youtube.com/embed/7yC2pQ4pE9o', description: 'How to clean and maintain your computer hardware.' }
    ]
  },
  {
    id: 'software',
    title: 'Computer Software',
    description: 'Learn about different types of software and how they interact with hardware.',
    icon: <Settings className="w-6 h-6" />,
    category: 'Advanced',
    lessons: [
      { id: 'sw-1', title: 'System Software', duration: '10:00', videoUrl: 'https://www.youtube.com/embed/u_K9oXv0M5k', description: 'Operating systems and device drivers.' },
      { id: 'sw-2', title: 'Application Software', duration: '08:00', videoUrl: 'https://www.youtube.com/embed/u_K9oXv0M5k', description: 'Word processors, browsers, and games.' },
      { id: 'sw-3', title: 'Software Installation', duration: '12:00', videoUrl: 'https://www.youtube.com/embed/u_K9oXv0M5k', description: 'How to safely install and uninstall programs.' },
      { id: 'sw-4', title: 'Updates & Security', duration: '10:00', videoUrl: 'https://www.youtube.com/embed/u_K9oXv0M5k', description: 'Keeping your software up to date and secure.' },
      { id: 'sw-5', title: 'Cloud Computing Basics', duration: '15:00', videoUrl: 'https://www.youtube.com/embed/u_K9oXv0M5k', description: 'Understanding software as a service.' }
    ]
  },
  {
    id: 'networking',
    title: 'Networking Basics',
    description: 'Learn how computers connect and communicate over networks.',
    icon: <Globe className="w-6 h-6" />,
    category: 'Advanced',
    lessons: [
      { id: 'net-1-adv', title: 'What is a Network?', duration: '10:00', videoUrl: 'https://www.youtube.com/embed/u_K9oXv0M5k', description: 'LAN, WAN, and the Internet.' },
      { id: 'net-2-adv', title: 'IP Addresses & DNS', duration: '12:00', videoUrl: 'https://www.youtube.com/embed/u_K9oXv0M5k', description: 'How devices are identified on a network.' },
      { id: 'net-3-adv', title: 'Routers & Switches', duration: '08:00', videoUrl: 'https://www.youtube.com/embed/u_K9oXv0M5k', description: 'The hardware that powers the internet.' },
      { id: 'net-4-adv', title: 'Wireless Networking', duration: '10:00', videoUrl: 'https://www.youtube.com/embed/u_K9oXv0M5k', description: 'Wi-Fi standards and security.' },
      { id: 'net-5-adv', title: 'Quiz', duration: '15:00', videoUrl: 'https://www.youtube.com/embed/u_K9oXv0M5k', description: 'Test your networking knowledge.', quiz: [
        { question: "What does LAN stand for?", options: ["Local Area Network", "Long Area Network", "Large Area Network", "Light Area Network"], correctAnswer: "Local Area Network" },
        { question: "Which device connects different networks?", options: ["Switch", "Router", "Hub", "Monitor"], correctAnswer: "Router" }
      ] }
    ]
  },
  {
    id: 'security',
    title: 'Cybersecurity Basics',
    description: 'Protect yourself and your data from online threats.',
    icon: <Lock className="w-6 h-6" />,
    category: 'Advanced',
    lessons: [
      { id: 'sec-1', title: 'Introduction to Security', duration: '08:00', videoUrl: 'https://www.youtube.com/embed/u_K9oXv0M5k', description: 'Why cybersecurity matters.' },
      { id: 'sec-2', title: 'Common Threats', duration: '12:00', videoUrl: 'https://www.youtube.com/embed/u_K9oXv0M5k', description: 'Viruses, worms, and ransomware.' },
      { id: 'sec-3', title: 'Password Security', duration: '10:00', videoUrl: 'https://www.youtube.com/embed/u_K9oXv0M5k', description: 'Creating strong passwords and using MFA.' },
      { id: 'sec-4', title: 'Safe Browsing', duration: '07:00', videoUrl: 'https://www.youtube.com/embed/u_K9oXv0M5k', description: 'How to spot suspicious websites.' },
      { id: 'sec-5', title: 'Quiz', duration: '15:00', videoUrl: 'https://www.youtube.com/embed/u_K9oXv0M5k', description: 'Test your security knowledge.', quiz: [
        { question: "What is MFA?", options: ["Multi-Factor Authentication", "Multi-File Access", "Main Frame Access", "Mobile Fast App"], correctAnswer: "Multi-Factor Authentication" },
        { question: "Which of these is a type of malware?", options: ["Word", "Excel", "Ransomware", "Chrome"], correctAnswer: "Ransomware" }
      ] }
    ]
  },
  {
    id: 'powerpoint',
    title: 'Microsoft PowerPoint',
    description: 'Create engaging and professional presentations.',
    icon: <Monitor className="w-6 h-6" />,
    category: 'Office',
    lessons: [
      { id: 'pp-1', title: 'Creating Your First Slide', duration: '06:00', videoUrl: 'https://www.youtube.com/embed/u7Tku3_RGPs', description: 'Choosing layouts and adding titles.' },
      { id: 'pp-2', title: 'Design & Themes', duration: '08:00', videoUrl: 'https://www.youtube.com/embed/u7Tku3_RGPs', description: 'Making your presentation look professional with themes.' },
      { id: 'pp-3', title: 'Transitions & Animations', duration: '12:00', videoUrl: 'https://www.youtube.com/embed/u7Tku3_RGPs', description: 'Adding movement to your slides and objects.' },
      { id: 'pp-4', title: 'Inserting Media', duration: '10:00', videoUrl: 'https://www.youtube.com/embed/u7Tku3_RGPs', description: 'Adding videos, audio, and charts.' },
      { id: 'pp-5', title: 'Presenting Like a Pro', duration: '07:00', videoUrl: 'https://www.youtube.com/embed/u7Tku3_RGPs', description: 'Presenter view, shortcuts, and delivery tips.' }
    ]
  },
  {
    id: 'photoshop',
    title: 'Photoshop Basics',
    description: 'Learn the fundamentals of image editing and graphic design.',
    icon: <Globe className="w-6 h-6" />,
    category: 'Advanced',
    lessons: [
      { id: 'ps-1', title: 'Interface & Tools', duration: '10:00', videoUrl: 'https://www.youtube.com/embed/IyR_uYsRdPs', description: 'Understanding the workspace and basic selection tools.' },
      { id: 'ps-2', title: 'Working with Layers', duration: '15:00', videoUrl: 'https://www.youtube.com/embed/IyR_uYsRdPs', description: 'The most important concept in Photoshop.' },
      { id: 'ps-3', title: 'Basic Photo Retouching', duration: '12:00', videoUrl: 'https://www.youtube.com/embed/IyR_uYsRdPs', description: 'Removing blemishes and adjusting colors.' },
      { id: 'ps-4', title: 'Text & Shapes', duration: '08:00', videoUrl: 'https://www.youtube.com/embed/IyR_uYsRdPs', description: 'Adding graphic elements to your designs.' },
      { id: 'ps-5', title: 'Exporting for Web', duration: '06:00', videoUrl: 'https://www.youtube.com/embed/IyR_uYsRdPs', description: 'Saving your work in the right format.' }
    ]
  },
  {
    id: 'coding',
    title: 'Coding Basics',
    description: 'Learn the fundamentals of programming and how to write code.',
    icon: <Zap className="w-6 h-6" />,
    category: 'Advanced',
    lessons: [
      { id: 'code-1', title: 'What is Programming?', duration: '10:00', videoUrl: 'https://www.youtube.com/embed/zOjov-2OZ0E', description: 'Introduction to how we talk to computers.' },
      { id: 'code-2', title: 'Variables & Data Types', duration: '12:00', videoUrl: 'https://www.youtube.com/embed/zOjov-2OZ0E', description: 'Storing and using information in code.' },
      { id: 'code-3', title: 'Control Flow', duration: '15:00', videoUrl: 'https://www.youtube.com/embed/zOjov-2OZ0E', description: 'Making decisions with if/else and loops.' },
      { id: 'code-4', title: 'Functions & Modules', duration: '15:00', videoUrl: 'https://www.youtube.com/embed/zOjov-2OZ0E', description: 'Reusing code and organizing programs.' },
      { id: 'code-5', title: 'Quiz', duration: '15:00', videoUrl: 'https://www.youtube.com/embed/zOjov-2OZ0E', description: 'Test your coding knowledge.', quiz: [
        { question: "What is a variable?", options: ["A storage container", "A type of monitor", "A keyboard shortcut", "A computer virus"], correctAnswer: "A storage container" },
        { question: "Which of these is a programming language?", options: ["Python", "Word", "Excel", "Chrome"], correctAnswer: "Python" }
      ] }
    ]
  }
];

const SHORTCUTS = [
  { key: 'Ctrl + C', action: 'Copy selected item' },
  { key: 'Ctrl + V', action: 'Paste copied item' },
  { key: 'Ctrl + X', action: 'Cut selected item' },
  { key: 'Ctrl + Z', action: 'Undo last action' },
  { key: 'Ctrl + S', action: 'Save current file' },
  { key: 'Ctrl + P', action: 'Print current document' },
  { key: 'Alt + Tab', action: 'Switch between open apps' },
  { key: 'Win + D', action: 'Show or hide desktop' },
  { key: 'Win + E', action: 'Open File Explorer' },
  { key: 'Win + L', action: 'Lock your computer' },
  { key: 'Ctrl + Alt + Del', action: 'Open Task Manager' },
  { key: 'F5', action: 'Refresh current window' },
];

const DICTIONARY = [
  { term: 'CPU', definition: 'Central Processing Unit - the "brain" of the computer.' },
  { term: 'RAM', definition: 'Random Access Memory - temporary storage for active data.' },
  { term: 'HDD/SSD', definition: 'Hard Disk Drive / Solid State Drive - permanent storage for files.' },
  { term: 'OS', definition: 'Operating System - software that manages hardware and other software.' },
  { term: 'Browser', definition: 'Software used to access and view websites on the internet.' },
  { term: 'Cloud', definition: 'Servers accessed over the internet for storage and processing.' },
  { term: 'Malware', definition: 'Malicious software designed to damage or gain unauthorized access.' },
  { term: 'Phishing', definition: 'Fraudulent attempt to obtain sensitive information like passwords.' },
  { term: 'Firewall', definition: 'Security system that monitors and controls network traffic.' },
  { term: 'IP Address', definition: 'Unique string of numbers that identifies a device on a network.' },
  { term: 'Algorithm', definition: 'A set of rules or steps to be followed in calculations or other problem-solving operations.' },
  { term: 'Bandwidth', definition: 'The maximum rate of data transfer across a given path.' },
  { term: 'Cache', definition: 'A hardware or software component that stores data so that future requests for that data can be served faster.' },
  { term: 'Database', definition: 'An organized collection of structured information, or data, typically stored electronically in a computer system.' },
  { term: 'Encryption', definition: 'The process of converting information or data into a code, especially to prevent unauthorized access.' },
  { term: 'Firmware', definition: 'Permanent software programmed into a read-only memory.' },
  { term: 'GUI', definition: 'Graphical User Interface - a type of user interface that allows users to interact with electronic devices through graphical icons and visual indicators.' },
  { term: 'HTML', definition: 'HyperText Markup Language - the standard markup language for documents designed to be displayed in a web browser.' },
  { term: 'ISP', definition: 'Internet Service Provider - a company that provides customers with access to the internet.' },
  { term: 'Kernel', definition: 'The core part of an operating system that manages operations of the computer and hardware.' },
  { term: 'LAN', definition: 'Local Area Network - a computer network that interconnects computers within a limited area such as a residence, school, or office building.' },
  { term: 'Modem', definition: 'A device that converts data from a digital format into a format suitable for an analog transmission medium such as telephone or radio.' },
  { term: 'Node', definition: 'A point in a network at which lines or pathways intersect or branch.' },
  { term: 'Protocol', definition: 'A set of rules governing the exchange or transmission of data between devices.' },
  { term: 'Router', definition: 'A networking device that forwards data packets between computer networks.' },
  { term: 'Server', definition: 'A computer or computer program which manages access to a centralized resource or service in a network.' },
  { term: 'URL', definition: 'Uniform Resource Locator - a reference to a web resource that specifies its location on a computer network and a mechanism for retrieving it.' },
  { term: 'VPN', definition: 'Virtual Private Network - extends a private network across a public network and enables users to send and receive data across shared or public networks as if their computing devices were directly connected to the private network.' },
  { term: 'WAN', definition: 'Wide Area Network - a telecommunications network that extends over a large geographic area for the primary purpose of computer networking.' },
];

const INTERVIEW_QUESTIONS = [
  { q: "What is a computer?", a: "A computer is an electronic device that processes data and performs tasks according to instructions given by a user." },
  { q: "What are the main components of a computer?", a: "The main components include the CPU (Central Processing Unit), RAM (Random Access Memory), Hard Drive/SSD (Storage), Motherboard, and Input/Output devices." },
  { q: "What is an Operating System?", a: "An Operating System (OS) is software that manages computer hardware and software resources and provides common services for computer programs." },
  { q: "What is the difference between RAM and ROM?", a: "RAM is volatile memory used for temporary storage while the computer is running, whereas ROM is non-volatile memory used for permanent storage of essential instructions." },
  { q: "What is a network?", a: "A network is a collection of computers and devices connected together to share resources and information." },
  { q: "What is the Internet?", a: "The Internet is a global network of interconnected computers that communicate using standardized protocols (TCP/IP)." },
  { q: "What is a firewall?", a: "A firewall is a security system that monitors and controls incoming and outgoing network traffic based on predetermined security rules." },
  { q: "What is cloud computing?", a: "Cloud computing is the delivery of computing services—including servers, storage, databases, networking, software, and more—over the internet." },
  { q: "What is an IP address?", a: "An Internet Protocol (IP) address is a numerical label assigned to each device connected to a computer network that uses the Internet Protocol for communication." },
  { q: "What is the purpose of a web browser?", a: "A web browser is a software application for accessing information on the World Wide Web. It retrieves content from a web server and displays it on the user's device." },
  { q: "What is a computer virus?", a: "A computer virus is a type of malicious software that, when executed, replicates itself by modifying other computer programs and inserting its own code." },
  { q: "What is the difference between HTTP and HTTPS?", a: "HTTP (Hypertext Transfer Protocol) is the standard protocol for transferring data over the web, while HTTPS (Hypertext Transfer Protocol Secure) is the secure version of HTTP, which uses encryption for communication." },
  { q: "What is a database management system (DBMS)?", a: "A DBMS is software that interacts with end users, applications, and the database itself to capture and analyze data." },
  { q: "What is the role of a router in a network?", a: "A router is a networking device that forwards data packets between computer networks, directing traffic on the internet." },
  { q: "What is the difference between 32-bit and 64-bit operating systems?", a: "The main difference is the amount of memory (RAM) the processor can handle. A 64-bit system can handle much more RAM than a 32-bit system, leading to better performance for memory-intensive tasks." },
  { q: "What is a backup?", a: "A backup is a copy of data taken and stored elsewhere so that it may be used to restore the original after a data loss event." },
];

const HARDWARE_GUIDE = [
  { name: 'Motherboard', description: 'The main circuit board that connects all components of the computer.', icon: <HardDrive className="w-6 h-6" /> },
  { name: 'CPU', description: 'The Central Processing Unit, often called the brain of the computer, performs calculations and executes instructions.', icon: <Cpu className="w-6 h-6" /> },
  { name: 'RAM', description: 'Random Access Memory provides temporary storage for data that the CPU needs to access quickly.', icon: <Zap className="w-6 h-6" /> },
  { name: 'Hard Drive (HDD/SSD)', description: 'Permanent storage for your files, programs, and the operating system.', icon: <HardDrive className="w-6 h-6" /> },
  { name: 'Graphics Card (GPU)', description: 'Handles rendering of images, videos, and animations, especially important for gaming and video editing.', icon: <Monitor className="w-6 h-6" /> },
  { name: 'Power Supply (PSU)', description: 'Converts electricity from your wall outlet into the specific type of power your computer components need.', icon: <Zap className="w-6 h-6" /> },
];

const DAILY_QUIZ_QUESTIONS = [
  { question: "What does CPU stand for?", options: ["Central Process Unit", "Central Processing Unit", "Computer Personal Unit", "Central Processor Unit"], correctAnswer: "Central Processing Unit" },
  { question: "Which key is used to refresh a web page?", options: ["F1", "F5", "F12", "Esc"], correctAnswer: "F5" },
  { question: "What is the shortcut to copy text?", options: ["Ctrl + P", "Ctrl + V", "Ctrl + C", "Ctrl + X"], correctAnswer: "Ctrl + C" },
  { question: "Which of these is an operating system?", options: ["Google", "Windows", "Intel", "Microsoft Word"], correctAnswer: "Windows" },
  { question: "What is the main function of RAM?", options: ["Permanent storage", "Temporary storage", "Printing documents", "Displaying images"], correctAnswer: "Temporary storage" },
];

const PRACTICE_TESTS = [
  {
    id: 'test-basics',
    title: 'Computer Basics Final',
    questions: [
      { question: "Which of these is NOT a hardware component?", options: ["CPU", "RAM", "Windows", "Monitor"], correctAnswer: "Windows" },
      { question: "What is the primary function of an Operating System?", options: ["Word processing", "Managing hardware and software", "Browsing the web", "Sending emails"], correctAnswer: "Managing hardware and software" },
      { question: "Which storage device is generally faster?", options: ["HDD", "SSD", "Floppy Disk", "CD-ROM"], correctAnswer: "SSD" }
    ]
  },
  {
    id: 'test-office',
    title: 'MS Office Specialist',
    questions: [
      { question: "In Excel, which symbol starts a formula?", options: ["+", "@", "=", "#"], correctAnswer: "=" },
      { question: "What is the default file extension for Word 2016?", options: [".txt", ".docx", ".doc", ".wrd"], correctAnswer: ".docx" },
      { question: "Which view in PowerPoint is best for organizing slides?", options: ["Normal", "Slide Sorter", "Notes Page", "Reading View"], correctAnswer: "Slide Sorter" }
    ]
  },
  {
    id: 'test-security',
    title: 'Cybersecurity Awareness',
    questions: [
      { question: "What is 'Phishing'?", options: ["A way to catch fish", "A fraudulent attempt to get sensitive info", "A type of computer virus", "A network protocol"], correctAnswer: "A fraudulent attempt to get sensitive info" },
      { question: "What does HTTPS stand for?", options: ["Hypertext Transfer Protocol Secure", "High Tech Transfer Protocol System", "Hyperlink Text Transfer Private", "Home Tool Transfer Process"], correctAnswer: "Hypertext Transfer Protocol Secure" },
      { question: "Which of these is a strong password?", options: ["123456", "password", "Admin@2024!", "qwerty"], correctAnswer: "Admin@2024!" }
    ]
  }
];

const DAILY_TIPS = [
  "Use 'Ctrl + Shift + T' to reopen the last closed tab in your browser.",
  "Regularly back up your important files to an external drive or cloud storage.",
  "Keep your software and operating system updated to stay protected from security threats.",
  "Use a strong, unique password for every online account.",
  "Clean your computer's keyboard and screen regularly to maintain hygiene.",
  "Don't click on suspicious links in emails or messages.",
  "Restart your computer at least once a week to clear system memory.",
  "Use 'Alt + F4' to quickly close the active window.",
];

const ASCII_TABLE = [
  { char: 'Space', dec: 32, hex: '20' },
  { char: '!', dec: 33, hex: '21' },
  { char: '"', dec: 34, hex: '22' },
  { char: '#', dec: 35, hex: '23' },
  { char: '$', dec: 36, hex: '24' },
  { char: '%', dec: 37, hex: '25' },
  { char: '&', dec: 38, hex: '26' },
  { char: "'", dec: 39, hex: '27' },
  { char: '(', dec: 40, hex: '28' },
  { char: ')', dec: 41, hex: '29' },
  { char: '*', dec: 42, hex: '2A' },
  { char: '+', dec: 43, hex: '2B' },
  { char: ',', dec: 44, hex: '2C' },
  { char: '-', dec: 45, hex: '2D' },
  { char: '.', dec: 46, hex: '2E' },
  { char: '/', dec: 47, hex: '2F' },
  { char: '0', dec: 48, hex: '30' },
  { char: '1', dec: 49, hex: '31' },
  { char: '2', dec: 50, hex: '32' },
  { char: '3', dec: 51, hex: '33' },
  { char: '4', dec: 52, hex: '34' },
  { char: '5', dec: 53, hex: '35' },
  { char: '6', dec: 54, hex: '36' },
  { char: '7', dec: 55, hex: '37' },
  { char: '8', dec: 56, hex: '38' },
  { char: '9', dec: 57, hex: '39' },
  { char: ':', dec: 58, hex: '3A' },
  { char: ';', dec: 59, hex: '3B' },
  { char: '<', dec: 60, hex: '3C' },
  { char: '=', dec: 61, hex: '3D' },
  { char: '>', dec: 62, hex: '3E' },
  { char: '?', dec: 63, hex: '3F' },
  { char: '@', dec: 64, hex: '40' },
  { char: 'A', dec: 65, hex: '41' },
  { char: 'B', dec: 66, hex: '42' },
  { char: 'C', dec: 67, hex: '43' },
  { char: 'D', dec: 68, hex: '44' },
  { char: 'E', dec: 69, hex: '45' },
  { char: 'F', dec: 70, hex: '46' },
  { char: 'G', dec: 71, hex: '47' },
  { char: 'H', dec: 72, hex: '48' },
  { char: 'I', dec: 73, hex: '49' },
  { char: 'J', dec: 74, hex: '4A' },
  { char: 'K', dec: 75, hex: '4B' },
  { char: 'L', dec: 76, hex: '4C' },
  { char: 'M', dec: 77, hex: '4D' },
  { char: 'N', dec: 78, hex: '4E' },
  { char: 'O', dec: 79, hex: '4F' },
  { char: 'P', dec: 80, hex: '50' },
  { char: 'Q', dec: 81, hex: '51' },
  { char: 'R', dec: 82, hex: '52' },
  { char: 'S', dec: 83, hex: '53' },
  { char: 'T', dec: 84, hex: '54' },
  { char: 'U', dec: 85, hex: '55' },
  { char: 'V', dec: 86, hex: '56' },
  { char: 'W', dec: 87, hex: '57' },
  { char: 'X', dec: 88, hex: '58' },
  { char: 'Y', dec: 89, hex: '59' },
  { char: 'Z', dec: 90, hex: '5A' },
];

export default function App() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [view, setView] = useState<'landing' | 'login' | 'signup' | 'dashboard' | 'course' | 'profile'>('landing');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [bookmarkedLessons, setBookmarkedLessons] = useState<Set<string>>(new Set());
  const [typingInput, setTypingInput] = useState('');
  const [excelTable, setExcelTable] = useState(Array(9).fill(''));
  const [excelCalc, setExcelCalc] = useState({ n1: '', n2: '', n3: '', result: '' });
  const [typingResult, setTypingResult] = useState('');
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: string }>({});
  const [quizResult, setQuizResult] = useState<string | null>(null);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);
  const [typingWpm, setTypingWpm] = useState(0);
  const [typingAccuracy, setTypingAccuracy] = useState(0);
  const [typingStartTime, setTypingStartTime] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'courses' | 'shortcuts' | 'dictionary' | 'interview' | 'hardware' | 'bookmarks' | 'tests' | 'tools'>('courses');
  const [testResult, setTestResult] = useState<{ [key: string]: string | null }>({});
  const [unitValue, setUnitValue] = useState('');
  const [unitFrom, setUnitFrom] = useState('MB');
  const [unitTo, setUnitTo] = useState('GB');
  const [unitResult, setUnitResult] = useState<string | null>(null);
  const [passwordLength, setPasswordLength] = useState(12);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [binaryInput, setBinaryInput] = useState('');
  const [decimalResult, setDecimalResult] = useState('');
  const [base64Input, setBase64Input] = useState('');
  const [base64Result, setBase64Result] = useState('');
  const [dailyTip, setDailyTip] = useState('');
  const [dailyQuiz, setDailyQuiz] = useState<typeof DAILY_QUIZ_QUESTIONS[0] | null>(null);
  const [dailyQuizAnswer, setDailyQuizAnswer] = useState<string | null>(null);
  const [dailyQuizResult, setDailyQuizResult] = useState<boolean | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const translations = {
    en: {
      welcome: "Welcome back",
      curriculum: "Your Curriculum",
      shortcuts: "Keyboard Shortcuts",
      dictionary: "Computer Dictionary",
      interview: "Interview Q&A",
      hardware: "Hardware Guide",
      bookmarks: "Bookmarks",
      tests: "Practice Tests",
      tools: "Tools",
      search: "Search for courses, lessons, or topics...",
      upgrade: "Upgrade",
      logout: "Logout",
      freePlan: "Free Plan",
      progressText: "You've completed {progress}% of your curriculum. Keep it up!",
      yourCurriculum: "Your Curriculum",
      courseContent: "Course Content",
      lessonOf: "Lesson {current} of {total}",
      durationText: "{duration} duration",
      bookmarkLesson: "Bookmark Lesson",
      typingSpeedTest: "Typing Speed Test",
      typeHere: "Type here...",
      startFullTest: "Start Full Test",
      premiumPlan: "Premium Plan",
      premiumDesc: "Unlock advanced hardware courses, coding basics, and get a certificate.",
      upgradeNow: "Upgrade Now",
      correct: "Correct! Well done.",
      incorrect: "Incorrect. Try again tomorrow!",
      needHelpTitle: "Need Help?",
      faq: "Frequently Asked Questions",
      contactSupport: "Contact Support",
      lessonsCompleted: "Lessons Completed",
      overallProgress: "Overall Progress",
      accountSettings: "Account Settings",
      displayName: "Display Name",
      saveChanges: "Save Changes",
      achievements: "Achievements",
      startLearning: "Start Learning Now",
      viewCourses: "View Courses",
      masterSkills: "Master Essential Computer Skills",
      fromAnywhere: "From Anywhere.",
      beginnerGuide: "Learn typing, Microsoft Office, and internet safety with our interactive curriculum designed for beginners.",
      typingTest: "Typing Speed Test",
      dailyQuiz: "Daily Quiz",
      dailyTip: "Daily Tip",
      needHelp: "Need Help?",
      downloadNotes: "Download Notes",
      markComplete: "Mark as Complete",
      completed: "Completed",
      courses: "Courses",
      unitConverter: "Unit Converter",
      passwordGenerator: "Password Generator",
      binaryConverter: "Binary Converter",
      asciiTable: "ASCII Table",
      base64Converter: "Base64 Converter",
      encode: "Encode",
      decode: "Decode",
      generate: "Generate",
      convert: "Convert",
      result: "Result",
      copy: "Copy",
      length: "Length",
      includeSymbols: "Include Symbols",
      includeNumbers: "Include Numbers",
      heroTitle: "Master Essential Computer Skills",
      heroHighlight: "From Anywhere.",
      heroDescription: "Learn typing, Microsoft Office, and internet safety with our interactive curriculum designed for beginners.",
      typingPracticeTitle: "Interactive Typing Practice",
      typingPracticeDesc: "Test your speed and accuracy with our real-time typing tool. No account required to try!",
      typingPlaceholder: "Start typing the text above...",
      loginTitle: "Welcome Back",
      loginDesc: "Log in to continue your learning journey",
      signupTitle: "Create Account",
      signupDesc: "Join thousands of students learning today",
      fullName: "Full Name",
      email: "Email Address",
      password: "Password",
      loginBtn: "Log In",
      signupBtn: "Sign Up",
      alreadyHaveAccount: "Already have an account?",
      dontHaveAccount: "Don't have an account?",
      loginLink: "Log In",
      signupLink: "Sign Up"
    },
    hi: {
      welcome: "वापसी पर स्वागत है",
      curriculum: "आपका पाठ्यक्रम",
      shortcuts: "कीबोर्ड शॉर्टकट",
      dictionary: "कंप्यूटर शब्दकोश",
      interview: "साक्षात्कार प्रश्न और उत्तर",
      hardware: "हार्डवेयर गाइड",
      bookmarks: "बुकमार्क",
      tests: "अभ्यास परीक्षण",
      tools: "उपकरण",
      search: "कोर्स, पाठ या विषयों के लिए खोजें...",
      upgrade: "अपग्रेड करें",
      logout: "लॉगआउट",
      freePlan: "निःशुल्क योजना",
      progressText: "आपने अपने पाठ्यक्रम का {progress}% पूरा कर लिया है। इसे जारी रखें!",
      yourCurriculum: "आपका पाठ्यक्रम",
      courseContent: "कोर्स सामग्री",
      lessonOf: "पाठ {current} का {total}",
      durationText: "{duration} अवधि",
      bookmarkLesson: "पाठ बुकमार्क करें",
      typingSpeedTest: "टाइपिंग स्पीड टेस्ट",
      typeHere: "यहाँ टाइप करें...",
      startFullTest: "पूर्ण परीक्षण शुरू करें",
      premiumPlan: "प्रीमियम योजना",
      premiumDesc: "उन्नत हार्डवेयर पाठ्यक्रम, कोडिंग मूल बातें अनलॉक करें और प्रमाणपत्र प्राप्त करें।",
      upgradeNow: "अभी अपग्रेड करें",
      correct: "सही! बहुत बढ़िया।",
      incorrect: "गलत। कल फिर कोशिश करें!",
      needHelpTitle: "मदद की ज़रूरत है?",
      faq: "अक्सर पूछे जाने वाले प्रश्न",
      contactSupport: "सहायता से संपर्क करें",
      lessonsCompleted: "पाठ पूरे हुए",
      overallProgress: "कुल प्रगति",
      accountSettings: "खाता सेटिंग",
      displayName: "प्रदर्शित नाम",
      saveChanges: "परिवर्तन सहेजें",
      achievements: "उपलब्धियां",
      startLearning: "अभी सीखना शुरू करें",
      viewCourses: "कोर्स देखें",
      masterSkills: "आवश्यक कंप्यूटर कौशल में महारत हासिल करें",
      fromAnywhere: "कहीं से भी।",
      beginnerGuide: "शुरुआती लोगों के लिए डिज़ाइन किए गए हमारे इंटरैक्टिव पाठ्यक्रम के साथ टाइपिंग, माइक्रोसॉफ्ट ऑफिस और इंटरनेट सुरक्षा सीखें।",
      typingTest: "टाइपिंग स्पीड टेस्ट",
      dailyQuiz: "दैनिक प्रश्नोत्तरी",
      dailyTip: "दैनिक टिप",
      needHelp: "मदद की ज़रूरत है?",
      downloadNotes: "नोट्स डाउनलोड करें",
      markComplete: "पूर्ण के रूप में चिह्नित करें",
      completed: "पूरा हुआ",
      courses: "कोर्स",
      unitConverter: "इकाई परिवर्तक",
      passwordGenerator: "पासवर्ड जनरेटर",
      binaryConverter: "बाइनरी परिवर्तक",
      asciiTable: "ASCII तालिका",
      base64Converter: "Base64 परिवर्तक",
      encode: "एन्कोड",
      decode: "डिकोड",
      generate: "बनाएँ",
      convert: "बदलें",
      result: "परिणाम",
      copy: "कॉपी करें",
      length: "लंबाई",
      includeSymbols: "प्रतीक शामिल करें",
      includeNumbers: "संख्याएँ शामिल करें",
      heroTitle: "आवश्यक कंप्यूटर कौशल में महारत हासिल करें",
      heroHighlight: "कहीं से भी।",
      heroDescription: "शुरुआती लोगों के लिए डिज़ाइन किए गए हमारे इंटरैक्टिव पाठ्यक्रम के साथ टाइपिंग, माइक्रोसॉफ्ट ऑफिस और इंटरनेट सुरक्षा सीखें।",
      typingPracticeTitle: "इंटरैक्टिव टाइपिंग अभ्यास",
      typingPracticeDesc: "हमारे रीयल-टाइम टाइपिंग टूल के साथ अपनी गति और सटीकता का परीक्षण करें। कोशिश करने के लिए किसी खाते की आवश्यकता नहीं है!",
      typingPlaceholder: "ऊपर दिए गए टेक्स्ट को टाइप करना शुरू करें...",
      loginTitle: "वापसी पर स्वागत है",
      loginDesc: "अपनी सीखने की यात्रा जारी रखने के लिए लॉग इन करें",
      signupTitle: "खाता बनाएँ",
      signupDesc: "आज ही सीखने वाले हजारों छात्रों में शामिल हों",
      fullName: "पूरा नाम",
      email: "ईमेल पता",
      password: "पासवर्ड",
      loginBtn: "लॉग इन करें",
      signupBtn: "साइन अप करें",
      alreadyHaveAccount: "पहले से ही एक खाता है?",
      dontHaveAccount: "खाता नहीं है?",
      loginLink: "लॉग इन करें",
      signupLink: "साइन अप करें"
    }
  };

  const t = translations[language];

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    setDailyTip(DAILY_TIPS[Math.floor(Math.random() * DAILY_TIPS.length)]);
    setDailyQuiz(DAILY_QUIZ_QUESTIONS[Math.floor(Math.random() * DAILY_QUIZ_QUESTIONS.length)]);
  }, []);

  useEffect(() => {
    setQuizAnswers({});
    setQuizResult(null);
  }, [currentLesson]);

  const typingTarget = "The quick brown fox jumps over the lazy dog";

  useEffect(() => {
    if (typingInput.length === 1 && !typingStartTime) {
      setTypingStartTime(Date.now());
    }
    
    if (typingInput === typingTarget && typingStartTime) {
      const endTime = Date.now();
      const timeInMinutes = (endTime - typingStartTime) / 60000;
      const words = typingTarget.split(' ').length;
      setTypingWpm(Math.round(words / timeInMinutes));
      
      let correctChars = 0;
      for (let i = 0; i < typingInput.length; i++) {
        if (typingInput[i] === typingTarget[i]) correctChars++;
      }
      setTypingAccuracy(Math.round((correctChars / typingTarget.length) * 100));
      setTypingStartTime(null);
    }
  }, [typingInput]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setView('dashboard');
      fetchProgress(parsedUser.email);
      
      const storedBookmarks = localStorage.getItem(`bookmarks_${parsedUser.email}`);
      if (storedBookmarks) {
        setBookmarkedLessons(new Set(JSON.parse(storedBookmarks)));
      }
    }
  }, []);

  const toggleBookmark = (lessonId: string) => {
    if (!user) return;
    setBookmarkedLessons(prev => {
      const next = new Set<string>(prev);
      if (next.has(lessonId)) {
        next.delete(lessonId);
      } else {
        next.add(lessonId);
      }
      localStorage.setItem(`bookmarks_${user.email}`, JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const fetchProgress = async (email: string) => {
    try {
      const res = await fetch(`/api/progress/${email}`);
      const data = await res.json();
      if (res.ok) {
        setCompletedLessons(new Set(data.completedLessons as string[]));
      }
    } catch (err) {
      console.error('Failed to fetch progress');
    }
  };

  const saveProgress = async (email: string, lessons: Set<string>) => {
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, completedLessons: Array.from(lessons) }),
      });
    } catch (err) {
      console.error('Failed to save progress');
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setView('login');
      } else {
        setAuthError('Signup failed. Please try again.');
      }
    } catch (err) {
      setAuthError('Connection error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify({ name: result.name, email: result.email }));
        setUser({ name: result.name, email: result.email });
        fetchProgress(result.email);
        setView('dashboard');
      } else {
        setAuthError(result.message || 'Login failed.');
      }
    } catch (err) {
      setAuthError('Connection error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setView('landing');
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setCurrentLesson(course.lessons[0]);
    setView('course');
  };

  const toggleLessonComplete = (lessonId: string) => {
    if (!user) return;
    setCompletedLessons(prev => {
      const next = new Set<string>(prev);
      if (next.has(lessonId)) {
        next.delete(lessonId);
      } else {
        next.add(lessonId);
      }
      saveProgress(user.email, next);
      return next;
    });
  };

  const progressPercentage = user ? Math.round((completedLessons.size / COURSES.reduce((acc, c) => acc + c.lessons.length, 0)) * 100) : 0;

  const handleQuizSubmit = () => {
    if (!currentLesson?.quiz) return;
    let score = 0;
    currentLesson.quiz.forEach((q, i) => {
      if (quizAnswers[i] === q.correctAnswer) score++;
    });
    const percentage = Math.round((score / currentLesson.quiz.length) * 100);
    setQuizResult(`You scored ${score}/${currentLesson.quiz.length} (${percentage}%)`);
    if (percentage >= 70) {
      toggleLessonComplete(currentLesson.id);
    }
  };

  const handleUnitConvert = () => {
    const val = parseFloat(unitValue);
    if (isNaN(val)) return;
    
    const units: { [key: string]: number } = {
      'B': 1,
      'KB': 1024,
      'MB': 1024 * 1024,
      'GB': 1024 * 1024 * 1024,
      'TB': 1024 * 1024 * 1024 * 1024
    };

    const bytes = val * units[unitFrom];
    const result = bytes / units[unitTo];
    setUnitResult(`${result.toFixed(4)} ${unitTo}`);
  };

  const handleDownloadNotes = () => {
    if (!currentLesson || !selectedCourse) return;
    const content = `
==================================================
${selectedCourse.title.toUpperCase()}
==================================================

Lesson: ${currentLesson.title}
Duration: ${currentLesson.duration} minutes

--------------------------------------------------
Description:
${currentLesson.description}

--------------------------------------------------
Notes:
${currentLesson.description}

--------------------------------------------------
Generated by Windows Operating System Training App
Date: ${new Date().toLocaleDateString()}
==================================================
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentLesson.title.replace(/\s+/g, '_')}_Notes.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" + 
      (includeNumbers ? "0123456789" : "") + 
      (includeSymbols ? "!@#$%^&*()_+~`|}{[]:;?><,./-=" : "");
    let retVal = "";
    for (let i = 0, n = charset.length; i < passwordLength; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    setGeneratedPassword(retVal);
  };

  const handleBinaryConvert = () => {
    if (!/^[01]+$/.test(binaryInput)) {
      setDecimalResult("Invalid binary");
      return;
    }
    setDecimalResult(parseInt(binaryInput, 2).toString());
  };

  const handleBase64Convert = (mode: 'encode' | 'decode') => {
    try {
      if (mode === 'encode') {
        setBase64Result(btoa(base64Input));
      } else {
        setBase64Result(atob(base64Input));
      }
    } catch (e) {
      setBase64Result('Invalid input for ' + mode);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTypingInput(val);
    if (val === typingTarget) {
      setTypingResult('Excellent! You typed it perfectly.');
    } else if (typingTarget.startsWith(val)) {
      setTypingResult('Keep going...');
    } else {
      setTypingResult('Mistake detected. Try again!');
    }
  };

  const isCourseComplete = (courseId: string) => {
    const course = COURSES.find(c => c.id === courseId);
    if (!course) return false;
    return course.lessons.every(l => completedLessons.has(l.id));
  };

  const getCourseProgress = (courseId: string) => {
    const course = COURSES.find(c => c.id === courseId);
    if (!course) return 0;
    const completed = course.lessons.filter(l => completedLessons.has(l.id)).length;
    return Math.round((completed / course.lessons.length) * 100);
  };

  const Certificate = ({ courseTitle, userName }: { courseTitle: string; userName: string }) => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div className="bg-white p-12 rounded-none border-[16px] border-double border-blue-900 max-w-3xl w-full text-center relative shadow-2xl">
        <div className="absolute top-4 right-4">
          <button onClick={() => setShowCertificate(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <LogOut className="w-6 h-6 text-slate-400 rotate-180" />
          </button>
        </div>
        <div className="space-y-8">
          <div className="flex justify-center">
            <Trophy className="w-16 h-16 text-amber-500" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-blue-900 uppercase tracking-widest">Certificate of Completion</h1>
          <p className="text-xl text-slate-600">This is to certify that</p>
          <h2 className="text-5xl font-serif font-bold text-slate-900 border-b-2 border-slate-300 pb-2 inline-block px-8">{userName}</h2>
          <p className="text-xl text-slate-600">has successfully completed the course</p>
          <h3 className="text-3xl font-bold text-blue-700">{courseTitle}</h3>
          <div className="pt-12 flex justify-between items-end">
            <div className="text-left">
              <div className="border-t border-slate-400 pt-2 px-4">
                <p className="font-bold text-slate-900">DigitalSkills Academy</p>
                <p className="text-sm text-slate-500">Authorized Signature</p>
              </div>
            </div>
            <div className="text-right">
              <div className="border-t border-slate-400 pt-2 px-4">
                <p className="font-bold text-slate-900">{new Date().toLocaleDateString()}</p>
                <p className="text-sm text-slate-500">Date of Achievement</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 flex justify-center gap-4 no-print">
          <button 
            onClick={() => window.print()}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <Printer className="w-5 h-5" /> Print Certificate
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => setView(user ? 'dashboard' : 'landing')}
            >
              <div className="bg-blue-600 p-2 rounded-lg">
                <Monitor className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight">DigitalSkills</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-3 py-1 text-xs font-bold bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 transition-colors"
              >
                {language === 'en' ? 'हिन्दी' : 'English'}
              </button>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-400"
                title="Toggle Dark Mode"
              >
                {isDarkMode ? <Zap className="w-5 h-5 text-amber-400" /> : <Monitor className="w-5 h-5" />}
              </button>
              {user ? (
                <div className="flex items-center gap-4">
                  <div 
                    className="hidden sm:flex flex-col items-end cursor-pointer"
                    onClick={() => setView('profile')}
                  >
                    <span className="text-sm font-medium dark:text-white">{user.name}</span>
                    <span className="text-xs text-slate-500">Student</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-400"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setView('login')}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => setView('signup')}
                    className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-shadow shadow-sm"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-16"
            >
              {/* Hero Section */}
              <section className="text-center py-12 sm:py-20 space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider">
                  <Trophy className="w-3 h-3" />
                  #1 Computer Skills Platform
                </div>
                <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl mx-auto">
                  {t.heroTitle} <span className="text-blue-600 dark:text-blue-400">{t.heroHighlight}</span>
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  {t.heroDescription}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button 
                    onClick={() => setView('signup')}
                    className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all hover:scale-105 shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                  >
                    {t.startLearning} <ChevronRight className="w-5 h-5" />
                  </button>
                  <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all">
                    {t.viewCourses}
                  </button>
                </div>
              </section>

              {/* Course Preview */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {COURSES.slice(0, 3).map((course) => (
                  <div key={course.id} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {course.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      {course.description}
                    </p>
                    <button 
                      onClick={() => setView('signup')}
                      className="text-blue-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Learn more <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </section>

              {/* Typing Practice Preview */}
              <section className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white overflow-hidden relative">
                <div className="relative z-10 max-w-2xl">
                  <h2 className="text-3xl font-bold mb-4">{t.typingPracticeTitle}</h2>
                  <p className="text-slate-400 mb-8">{t.typingPracticeDesc}</p>
                  
                  <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
                    <p className="text-lg font-mono mb-4 text-emerald-400 select-none">
                      {typingTarget}
                    </p>
                    <input 
                      type="text" 
                      value={typingInput}
                      onChange={handleTyping}
                      placeholder={t.typingPlaceholder}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                    />
                    {typingResult && (
                      <p className={`mt-4 text-sm font-medium ${typingResult.includes('Excellent') ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {typingResult}
                      </p>
                    )}
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-600/20 to-transparent hidden lg:block" />
              </section>
            </motion.div>
          )}

          {(view === 'login' || view === 'signup') && (
            <motion.div 
              key="auth"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto mt-12 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold">{view === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                <p className="text-slate-500 mt-2">
                  {view === 'login' ? 'Log in to continue your learning journey' : 'Join thousands of students learning today'}
                </p>
              </div>

              {authError && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100">
                  {authError}
                </div>
              )}

              <form onSubmit={view === 'login' ? handleLogin : handleSignup} className="space-y-4">
                {view === 'signup' && (
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-slate-700">{t.fullName}</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                      <input 
                        name="name"
                        type="text" 
                        required
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-700">{t.email}</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input 
                      name="email"
                      type="email" 
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-slate-700">{t.password}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input 
                      name="password"
                      type="password" 
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <button 
                  disabled={isLoading}
                  className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-100"
                >
                  {isLoading ? 'Processing...' : (view === 'login' ? t.loginBtn : t.signupBtn)}
                </button>
              </form>

              <div className="mt-8 text-center">
                <button 
                  onClick={() => setView(view === 'login' ? 'signup' : 'login')}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  {view === 'login' ? `${t.dontHaveAccount} ${t.signupLink}` : `${t.alreadyHaveAccount} ${t.loginLink}`}
                </button>
              </div>
            </motion.div>
          )}

          {view === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight">{t.welcome}, {user?.name}!</h2>
                  <p className="text-slate-500 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    {t.progressText.replace('{progress}', progressPercentage.toString())}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-emerald-100">
                    <CheckCircle2 className="w-4 h-4" /> {t.freePlan}
                  </div>
                  <button className="bg-slate-900 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all hover:scale-105 flex items-center gap-2 shadow-lg shadow-slate-200">
                    <CreditCard className="w-4 h-4" /> {t.upgrade}
                  </button>
                </div>
              </header>

              {/* Daily Tip & Search */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder={t.search}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                  />
                </div>
                <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-100 flex items-start gap-3 relative overflow-hidden group">
                  <div className="bg-white/20 p-2 rounded-lg shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">{t.dailyTip}</span>
                    <p className="text-xs font-medium leading-relaxed mt-1">{dailyTip}</p>
                  </div>
                  <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit overflow-x-auto max-w-full no-scrollbar">
                <button 
                  onClick={() => setActiveTab('courses')}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'courses' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {t.courses || "Courses"}
                </button>
                <button 
                  onClick={() => setActiveTab('shortcuts')}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'shortcuts' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {t.shortcuts}
                </button>
                <button 
                  onClick={() => setActiveTab('dictionary')}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'dictionary' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {t.dictionary}
                </button>
                <button 
                  onClick={() => setActiveTab('interview')}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'interview' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {t.interview}
                </button>
                <button 
                  onClick={() => setActiveTab('hardware')}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'hardware' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {t.hardware}
                </button>
                <button 
                  onClick={() => setActiveTab('bookmarks')}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'bookmarks' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {t.bookmarks}
                </button>
                <button 
                  onClick={() => setActiveTab('tests')}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'tests' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {t.tests}
                </button>
                <button 
                  onClick={() => setActiveTab('tools')}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'tools' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {t.tools}
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {activeTab === 'courses' && (
                    <>
                      <h3 className="text-xl font-bold px-2">{t.yourCurriculum}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {COURSES.filter(c => 
                          c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map((course) => (
                          <motion.div 
                            layout
                            key={course.id} 
                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-blue-300 transition-all cursor-pointer group shadow-sm hover:shadow-md"
                            onClick={() => handleCourseSelect(course)}
                          >
                            <div className="aspect-video bg-slate-100 relative overflow-hidden">
                              <img 
                                src={`https://picsum.photos/seed/${course.id}/640/360`} 
                                alt={course.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                                {course.category}
                              </div>
                              {isCourseComplete(course.id) && (
                                <div className="absolute top-3 right-3 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg">
                                  <CheckCircle2 className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                            <div className="p-6">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 text-blue-600">
                                  {course.icon}
                                  <span className="text-xs font-bold uppercase tracking-widest">Course</span>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">{course.lessons.length} Lessons</span>
                              </div>
                              <h4 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors dark:text-white">{course.title}</h4>
                              <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed mb-4">{course.description}</p>
                              
                              <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                                  <span>Progress</span>
                                  <span>{getCourseProgress(course.id)}%</span>
                                </div>
                                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${getCourseProgress(course.id)}%` }}
                                    className="h-full bg-blue-600"
                                  />
                                </div>
                              </div>

                              {isCourseComplete(course.id) && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCourse(course);
                                    setShowCertificate(true);
                                  }}
                                  className="w-full py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
                                >
                                  <Trophy className="w-3 h-3" /> View Certificate
                                </button>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  )}

                  {activeTab === 'shortcuts' && (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                      <div className="p-6 border-bottom border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                        <h3 className="text-xl font-bold flex items-center gap-2 dark:text-white">
                          <Zap className="w-5 h-5 text-amber-500" />
                          Keyboard Shortcuts
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Boost your productivity with these essential Windows shortcuts.</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-100 dark:bg-slate-800">
                        {SHORTCUTS.filter(s => 
                          s.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.key.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map((s, i) => (
                          <div key={i} className="bg-white dark:bg-slate-900 p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{s.action}</span>
                            <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-bold text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700">{s.key}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'dictionary' && (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                      <div className="p-6 border-bottom border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                        <h3 className="text-xl font-bold flex items-center gap-2 dark:text-white">
                          <Book className="w-5 h-5 text-blue-500" />
                          Computer Dictionary
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Master the language of technology with our glossary.</p>
                      </div>
                      <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {DICTIONARY.filter(d => 
                          d.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.definition.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map((d, i) => (
                          <div key={i} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                            <h4 className="font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">{d.term}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{d.definition}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'interview' && (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                      <div className="p-6 border-bottom border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                        <h3 className="text-xl font-bold flex items-center gap-2 dark:text-white">
                          <HelpCircle className="w-5 h-5 text-emerald-500" />
                          Interview Questions & Answers
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Prepare for your next technical interview with these common questions.</p>
                      </div>
                      <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {INTERVIEW_QUESTIONS.filter(q => 
                          q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.a.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map((q, i) => (
                          <div key={i} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Q: {q.q}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">A: {q.a}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'hardware' && (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                      <div className="p-6 border-bottom border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                        <h3 className="text-xl font-bold flex items-center gap-2 dark:text-white">
                          <Cpu className="w-5 h-5 text-blue-500" />
                          Hardware Guide
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Learn about the physical components that make up a computer.</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
                        {HARDWARE_GUIDE.filter(h => 
                          h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          h.description.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map((h, i) => (
                          <div key={i} className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-blue-300 transition-all group">
                            <div className="bg-white dark:bg-slate-900 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 shadow-sm group-hover:scale-110 transition-transform">
                              {h.icon}
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-2">{h.name}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{h.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'bookmarks' && (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                      <div className="p-6 border-bottom border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                        <h3 className="text-xl font-bold flex items-center gap-2 dark:text-white">
                          <Book className="w-5 h-5 text-blue-500" />
                          Your Bookmarks
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Quickly access your saved lessons.</p>
                      </div>
                      <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {COURSES.flatMap(c => c.lessons).filter(l => bookmarkedLessons.has(l.id)).length > 0 ? (
                          COURSES.flatMap(c => c.lessons).filter(l => bookmarkedLessons.has(l.id)).map((l, i) => (
                            <div 
                              key={i} 
                              className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group cursor-pointer flex items-center justify-between"
                              onClick={() => {
                                const course = COURSES.find(c => c.lessons.some(lesson => lesson.id === l.id));
                                if (course) {
                                  setSelectedCourse(course);
                                  setCurrentLesson(l);
                                  setView('course');
                                }
                              }}
                            >
                              <div>
                                <h4 className="font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">{l.title}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest font-bold">{l.duration} MIN</p>
                              </div>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleBookmark(l.id);
                                }}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-blue-600"
                              >
                                <Book className="w-5 h-5 fill-current" />
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="p-12 text-center">
                            <Book className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-500 dark:text-slate-400">You haven't bookmarked any lessons yet.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'tests' && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold px-2">Practice Tests</h3>
                      <div className="grid grid-cols-1 gap-6">
                        {PRACTICE_TESTS.map((test) => (
                          <div key={test.id} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                            <div className="flex items-center justify-between">
                              <h4 className="text-lg font-bold dark:text-white">{test.title}</h4>
                              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{test.questions.length} Questions</span>
                            </div>
                            <div className="space-y-8">
                              {test.questions.map((q, qIdx) => (
                                <div key={qIdx} className="space-y-4">
                                  <p className="font-medium text-slate-700 dark:text-slate-300">{qIdx + 1}. {q.question}</p>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {q.options.map((opt, oIdx) => (
                                      <button 
                                        key={oIdx}
                                        onClick={() => {
                                          const key = `${test.id}_${qIdx}`;
                                          setQuizAnswers(prev => ({ ...prev, [key]: opt }));
                                        }}
                                        className={`p-4 rounded-xl text-sm text-left transition-all border ${
                                          quizAnswers[`${test.id}_${qIdx}`] === opt
                                            ? 'bg-blue-600 border-blue-600 text-white'
                                            : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-300'
                                        }`}
                                      >
                                        {opt}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <button 
                              onClick={() => {
                                let score = 0;
                                test.questions.forEach((q, i) => {
                                  if (quizAnswers[`${test.id}_${i}`] === q.correctAnswer) score++;
                                });
                                setTestResult(prev => ({ ...prev, [test.id]: `Score: ${score}/${test.questions.length}` }));
                              }}
                              className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                            >
                              Submit Test
                            </button>
                            {testResult[test.id] && (
                              <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl text-center font-bold border border-emerald-100">
                                {testResult[test.id]}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'tools' && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold px-2 dark:text-white">{t.tools}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Unit Converter */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                              <Zap className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold dark:text-white">{t.unitConverter}</h4>
                          </div>
                          <div className="space-y-4">
                            <input 
                              type="number" 
                              value={unitValue}
                              onChange={(e) => setUnitValue(e.target.value)}
                              placeholder="Enter value"
                              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <select 
                                value={unitFrom}
                                onChange={(e) => setUnitFrom(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                              >
                                {['B', 'KB', 'MB', 'GB', 'TB'].map(u => <option key={u} value={u}>{u}</option>)}
                              </select>
                              <select 
                                value={unitTo}
                                onChange={(e) => setUnitTo(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                              >
                                {['B', 'KB', 'MB', 'GB', 'TB'].map(u => <option key={u} value={u}>{u}</option>)}
                              </select>
                            </div>
                            <button 
                              onClick={handleUnitConvert}
                              className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all"
                            >
                              {t.convert}
                            </button>
                            {unitResult && (
                              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl text-center font-bold border border-blue-100 dark:border-blue-800">
                                {t.result}: {unitResult}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Password Generator */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                          <div className="flex items-center gap-3">
                            <div className="bg-emerald-50 dark:bg-emerald-900/30 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
                              <Shield className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold dark:text-white">{t.passwordGenerator}</h4>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium dark:text-slate-300">{t.length}: {passwordLength}</label>
                              <input 
                                type="range" 
                                min="8" 
                                max="32" 
                                value={passwordLength}
                                onChange={(e) => setPasswordLength(parseInt(e.target.value))}
                                className="w-32"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="flex items-center gap-2 text-sm dark:text-slate-300">
                                <input type="checkbox" checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} />
                                {t.includeNumbers}
                              </label>
                              <label className="flex items-center gap-2 text-sm dark:text-slate-300">
                                <input type="checkbox" checked={includeSymbols} onChange={(e) => setIncludeSymbols(e.target.checked)} />
                                {t.includeSymbols}
                              </label>
                            </div>
                            <button 
                              onClick={generatePassword}
                              className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all"
                            >
                              {t.generate}
                            </button>
                            {generatedPassword && (
                              <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between">
                                <code className="text-blue-600 dark:text-blue-400 font-bold break-all">{generatedPassword}</code>
                                <button 
                                  onClick={() => navigator.clipboard.writeText(generatedPassword)}
                                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                  title={t.copy}
                                >
                                  <Copy className="w-4 h-4 text-slate-500" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Binary Converter */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                          <div className="flex items-center gap-3">
                            <div className="bg-amber-50 dark:bg-amber-900/30 p-2 rounded-lg text-amber-600 dark:text-amber-400">
                              <Cpu className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold dark:text-white">{t.binaryConverter}</h4>
                          </div>
                          <div className="space-y-4">
                            <input 
                              type="text" 
                              value={binaryInput}
                              onChange={(e) => setBinaryInput(e.target.value.replace(/[^01]/g, ''))}
                              placeholder="Enter binary (e.g. 1010)"
                              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                            />
                            <button 
                              onClick={handleBinaryConvert}
                              className="w-full py-4 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition-all"
                            >
                              {t.convert}
                            </button>
                            {decimalResult && (
                              <div className="p-4 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-xl text-center font-bold border border-amber-100 dark:border-amber-800">
                                {t.result}: {decimalResult}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Base64 Converter */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                          <div className="flex items-center gap-3">
                            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg text-indigo-600 dark:text-indigo-400">
                              <FileCode className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold dark:text-white">{t.base64Converter}</h4>
                          </div>
                          <div className="space-y-4">
                            <textarea 
                              value={base64Input}
                              onChange={(e) => setBase64Input(e.target.value)}
                              placeholder="Enter text or Base64"
                              rows={3}
                              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white resize-none"
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <button 
                                onClick={() => handleBase64Convert('encode')}
                                className="py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all"
                              >
                                {t.encode}
                              </button>
                              <button 
                                onClick={() => handleBase64Convert('decode')}
                                className="py-4 bg-slate-600 text-white font-bold rounded-xl hover:bg-slate-700 transition-all"
                              >
                                {t.decode}
                              </button>
                            </div>
                            {base64Result && (
                              <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between">
                                <code className="text-indigo-600 dark:text-indigo-400 font-bold break-all">{base64Result}</code>
                                <button 
                                  onClick={() => navigator.clipboard.writeText(base64Result)}
                                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                  title={t.copy}
                                >
                                  <Copy className="w-4 h-4 text-slate-500" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* ASCII Table */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 md:col-span-2">
                          <div className="flex items-center gap-3">
                            <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg text-slate-600 dark:text-slate-400">
                              <Table className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold dark:text-white">{t.asciiTable}</h4>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                              <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800">
                                  <th className="py-3 px-4 font-bold dark:text-slate-300">Char</th>
                                  <th className="py-3 px-4 font-bold dark:text-slate-300">Decimal</th>
                                  <th className="py-3 px-4 font-bold dark:text-slate-300">Hex</th>
                                </tr>
                              </thead>
                              <tbody>
                                {ASCII_TABLE.map((row, idx) => (
                                  <tr key={idx} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="py-3 px-4 font-mono dark:text-white">{row.char}</td>
                                    <td className="py-3 px-4 dark:text-slate-400">{row.dec}</td>
                                    <td className="py-3 px-4 dark:text-slate-400">{row.hex}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-bold px-2">Quick Access</h3>
                  
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-50 dark:bg-amber-900/30 p-2 rounded-lg text-amber-600 dark:text-amber-400">
                        <Keyboard className="w-5 h-5" />
                      </div>
                      <span className="font-bold dark:text-white">{t.typingSpeedTest}</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 italic">"The quick brown fox jumps over the lazy dog"</p>
                    <input 
                      type="text" 
                      value={typingInput}
                      onChange={handleTyping}
                      placeholder={t.typeHere}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                    {typingWpm > 0 && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl text-center">
                          <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">WPM</p>
                          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{typingWpm}</p>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-xl text-center">
                          <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Accuracy</p>
                          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{typingAccuracy}%</p>
                        </div>
                      </div>
                    )}
                    <button className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4" /> {t.startFullTest}
                    </button>
                  </div>

                  <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden group">
                    <div className="relative z-10">
                      <h4 className="font-bold text-lg mb-2">{t.premiumPlan}</h4>
                      <p className="text-slate-400 text-sm mb-6">{t.premiumDesc}</p>
                      <button className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20">
                        {t.upgradeNow}
                      </button>
                    </div>
                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
                  </div>

                  {dailyQuiz && (
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                      <h4 className="font-bold flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-emerald-500" />
                        {t.dailyQuiz}
                      </h4>
                      <p className="text-sm font-medium text-slate-700">{dailyQuiz.question}</p>
                      <div className="space-y-2">
                        {dailyQuiz.options.map((opt, i) => (
                          <button 
                            key={i}
                            onClick={() => {
                              setDailyQuizAnswer(opt);
                              setDailyQuizResult(opt === dailyQuiz.correctAnswer);
                            }}
                            className={`w-full text-left p-3 rounded-xl text-sm transition-all border ${
                              dailyQuizAnswer === opt 
                                ? (opt === dailyQuiz.correctAnswer ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700')
                                : 'bg-slate-50 border-slate-100 hover:border-slate-200 text-slate-600'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      {dailyQuizResult !== null && (
                        <p className={`text-xs font-bold ${dailyQuizResult ? 'text-emerald-600' : 'text-red-600'}`}>
                          {dailyQuizResult ? t.correct : t.incorrect}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h4 className="font-bold mb-4 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-slate-400" />
                      {t.needHelpTitle}
                    </h4>
                    <div className="space-y-3">
                      <button className="w-full p-3 text-left text-sm font-medium hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                        {t.faq}
                      </button>
                      <button className="w-full p-3 text-left text-sm font-medium hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                        {t.contactSupport}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'profile' && user && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-32 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <User className="w-16 h-16" />
                </div>
                <div className="text-center md:text-left space-y-2">
                  <h2 className="text-3xl font-bold dark:text-white">{user.name}</h2>
                  <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                    <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-emerald-100 dark:border-emerald-800">
                      <Trophy className="w-4 h-4" /> {completedLessons.size} {t.lessonsCompleted}
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-blue-100 dark:border-blue-800">
                      <Monitor className="w-4 h-4" /> {progressPercentage}% {t.overallProgress}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-2 dark:text-white">
                    <Settings className="w-5 h-5 text-slate-400" />
                    {t.accountSettings}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">{t.displayName}</label>
                      <input 
                        type="text" 
                        defaultValue={user.name}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">{t.email}</label>
                      <input 
                        type="email" 
                        defaultValue={user.email}
                        disabled
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 cursor-not-allowed"
                      />
                    </div>
                    <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all">
                      {t.saveChanges}
                    </button>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-2 dark:text-white">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    {t.achievements}
                  </h3>
                  <div className="space-y-4">
                    {COURSES.filter(c => isCourseComplete(c.id)).length > 0 ? (
                      COURSES.filter(c => isCourseComplete(c.id)).map(course => (
                        <div key={course.id} className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                          <div className="bg-white dark:bg-slate-800 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
                            {course.icon}
                          </div>
                          <div>
                            <p className="font-bold text-emerald-800 dark:text-emerald-200">{course.title}</p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400">Completed on {new Date().toLocaleDateString()}</p>
                          </div>
                          <button 
                            onClick={() => {
                              setSelectedCourse(course);
                              setShowCertificate(true);
                            }}
                            className="ml-auto p-2 hover:bg-emerald-100 dark:hover:bg-emerald-800 rounded-full transition-colors text-emerald-600 dark:text-emerald-400"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Trophy className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-500 dark:text-slate-400">No achievements yet. Complete a course to earn your first certificate!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'course' && selectedCourse && currentLesson && (
            <motion.div 
              key="course-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <button 
                onClick={() => setView('dashboard')}
                className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition-colors"
              >
                <ChevronRight className="w-5 h-5 rotate-180" /> Back to Dashboard
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative">
                    <iframe 
                      key={currentLesson.id}
                      width="100%" 
                      height="100%" 
                      src={currentLesson.videoUrl} 
                      title={currentLesson.title}
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                      className="absolute inset-0"
                    ></iframe>
                  </div>
                  <div className="bg-white p-8 rounded-3xl border border-slate-200">
                    <h2 className="text-3xl font-bold mb-4">{currentLesson.title}</h2>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      {currentLesson.description}
                    </p>

                    {/* Generic Quiz Component */}
                    {currentLesson.quiz && (
                      <div className="mt-8 bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-8">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                            <HelpCircle className="w-6 h-6" />
                          </div>
                          <h3 className="text-2xl font-bold">Lesson Quiz</h3>
                        </div>
                        
                        {currentLesson.quiz.map((q, qIdx) => (
                          <div key={qIdx} className="space-y-4">
                            <p className="font-bold text-lg text-slate-800">{qIdx + 1}. {q.question}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {q.options.map((opt, oIdx) => (
                                <label 
                                  key={oIdx} 
                                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                                    quizAnswers[qIdx] === opt 
                                      ? 'border-blue-600 bg-blue-50 text-blue-700' 
                                      : 'border-slate-200 bg-white hover:border-slate-300'
                                  }`}
                                >
                                  <input 
                                    type="radio" 
                                    name={`quiz-${qIdx}`} 
                                    value={opt}
                                    checked={quizAnswers[qIdx] === opt}
                                    onChange={(e) => setQuizAnswers({...quizAnswers, [qIdx]: e.target.value})}
                                    className="hidden"
                                  />
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    quizAnswers[qIdx] === opt ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                                  }`}>
                                    {quizAnswers[qIdx] === opt && <div className="w-2 h-2 bg-white rounded-full" />}
                                  </div>
                                  <span className="font-medium">{opt}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}

                        <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                          <button 
                            onClick={handleQuizSubmit}
                            className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                          >
                            Submit Quiz Answers
                          </button>
                          
                          {quizResult && (
                            <motion.div 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={`flex items-center gap-2 font-bold text-lg ${quizResult.includes('100%') || quizResult.includes('70%') ? 'text-emerald-600' : 'text-amber-600'}`}
                            >
                              {quizResult.includes('70%') || quizResult.includes('100%') ? <CheckCircle2 className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                              {quizResult}
                            </motion.div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Interactive Intro Content */}
                    {currentLesson.id === 'intro-1' && (
                      <div className="mt-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <p className="font-medium mb-3">Computers are used for:</p>
                        <ul className="space-y-2 list-disc list-inside text-slate-700">
                          <li>Typing documents</li>
                          <li>Browsing the internet</li>
                          <li>Sending emails</li>
                          <li>Watching videos</li>
                          <li>Business and education</li>
                        </ul>
                      </div>
                    )}

                    {currentLesson.id === 'intro-2' && (
                      <div className="mt-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <ul className="space-y-2 list-disc list-inside text-slate-700">
                          <li>Desktop Computer</li>
                          <li>Laptop Computer</li>
                          <li>Tablet</li>
                          <li>Smartphone</li>
                        </ul>
                      </div>
                    )}

                    {currentLesson.id === 'intro-3' && (
                      <div className="mt-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <ul className="space-y-3 text-slate-700">
                          <li><span className="font-bold">Monitor</span> – Displays information</li>
                          <li><span className="font-bold">Keyboard</span> – Used for typing</li>
                          <li><span className="font-bold">Mouse</span> – Used to control the pointer</li>
                          <li><span className="font-bold">CPU</span> – Brain of the computer</li>
                          <li><span className="font-bold">Printer</span> – Prints documents</li>
                        </ul>
                      </div>
                    )}

                    {currentLesson.id === 'intro-5' && (
                      <div className="mt-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
                        <div className="space-y-4">
                          <p className="font-medium">1. Which device is used for typing?</p>
                          <div className="space-y-2">
                            {['Monitor', 'Keyboard', 'Printer'].map((opt, i) => (
                              <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                  type="radio" 
                                  name="q1" 
                                  value={['a', 'b', 'c'][i]}
                                  checked={quizAnswers.q1 === ['a', 'b', 'c'][i]}
                                  onChange={(e) => setQuizAnswers({...quizAnswers, q1: e.target.value})}
                                  className="w-4 h-4 text-blue-600"
                                />
                                <span className="group-hover:text-blue-600 transition-colors">{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <p className="font-medium">2. Which part is called the brain of the computer?</p>
                          <div className="space-y-2">
                            {['CPU', 'Mouse', 'Monitor'].map((opt, i) => (
                              <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                  type="radio" 
                                  name="q2" 
                                  value={['a', 'b', 'c'][i]}
                                  checked={quizAnswers.q2 === ['a', 'b', 'c'][i]}
                                  onChange={(e) => setQuizAnswers({...quizAnswers, q2: e.target.value})}
                                  className="w-4 h-4 text-blue-600"
                                />
                                <span className="group-hover:text-blue-600 transition-colors">{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <button 
                          onClick={() => {
                            let score = 0;
                            if (quizAnswers.q1 === 'b') score++;
                            if (quizAnswers.q2 === 'a') score++;
                            setQuizResult(`You scored ${score} / 2`);
                          }}
                          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
                        >
                          Submit Quiz
                        </button>

                        {quizResult && (
                          <p className="text-xl font-bold text-blue-600 animate-in fade-in slide-in-from-top-2">{quizResult}</p>
                        )}
                      </div>
                    )}

                    {/* Interactive Windows Content */}
                    {currentLesson.id === 'win-1' && (
                      <div className="mt-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <p className="font-medium mb-3">Using the Mouse Effectively:</p>
                        <ul className="space-y-2 list-disc list-inside text-slate-700">
                          <li><span className="font-bold">Left Click</span> – select an item</li>
                          <li><span className="font-bold">Double Click</span> – open a program or file</li>
                          <li><span className="font-bold">Right Click</span> – open menu options</li>
                          <li><span className="font-bold">Scroll Wheel</span> – move up or down a page</li>
                          <li><span className="font-bold">Drag and Drop</span> – move files</li>
                        </ul>
                      </div>
                    )}

                    {currentLesson.id === 'win-2' && (
                      <div className="mt-6 space-y-6">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                          <p className="font-medium mb-3">Changing Desktop Background:</p>
                          <ol className="space-y-2 list-decimal list-inside text-slate-700">
                            <li>Right-click on the desktop</li>
                            <li>Select <span className="font-bold">Personalize</span></li>
                            <li>Choose <span className="font-bold">Background</span></li>
                            <li>Select picture</li>
                          </ol>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                          <p className="font-medium mb-3">Creating Desktop Icons:</p>
                          <ol className="space-y-2 list-decimal list-inside text-slate-700">
                            <li>Right click on desktop</li>
                            <li>Select <span className="font-bold">New</span></li>
                            <li>Click <span className="font-bold">Shortcut</span></li>
                            <li>Choose program</li>
                          </ol>
                        </div>
                      </div>
                    )}

                    {currentLesson.id === 'win-3' && (
                      <div className="mt-6 space-y-6">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                          <p className="font-medium mb-3">Creating a Folder:</p>
                          <ol className="space-y-2 list-decimal list-inside text-slate-700">
                            <li>Right click inside a folder</li>
                            <li>Select <span className="font-bold">New</span></li>
                            <li>Click <span className="font-bold">Folder</span></li>
                            <li>Type folder name</li>
                          </ol>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                          <p className="font-medium mb-3">Recycle Bin:</p>
                          <p className="text-slate-700">The recycle bin temporarily stores deleted files. You can restore files or permanently delete them.</p>
                        </div>
                      </div>
                    )}

                    {currentLesson.id === 'win-4' && (
                      <div className="mt-6 space-y-6">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                          <p className="font-medium mb-3">Windows Utility Programs:</p>
                          <div className="grid grid-cols-2 gap-2 text-slate-700">
                            <li>Calculator</li>
                            <li>Snipping Tool</li>
                            <li>Paint</li>
                            <li>Voice Recorder</li>
                            <li>Narrator</li>
                            <li>On-Screen Keyboard</li>
                          </div>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                          <p className="font-medium mb-3">Using a Flash Drive:</p>
                          <ol className="space-y-2 list-decimal list-inside text-slate-700">
                            <li>Insert flash drive into USB port</li>
                            <li>Open File Explorer</li>
                            <li>Locate USB drive</li>
                            <li>Copy or paste files</li>
                          </ol>
                        </div>
                      </div>
                    )}

                    {currentLesson.id === 'win-5' && (
                      <div className="mt-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
                        <div className="space-y-4">
                          <p className="font-medium">1. Where do deleted files go first?</p>
                          <div className="space-y-2">
                            {['Recycle Bin', 'Monitor', 'Keyboard'].map((opt, i) => (
                              <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                  type="radio" 
                                  name="q1" 
                                  value={['a', 'b', 'c'][i]}
                                  checked={quizAnswers.q1 === ['a', 'b', 'c'][i]}
                                  onChange={(e) => setQuizAnswers({...quizAnswers, q1: e.target.value})}
                                  className="w-4 h-4 text-blue-600"
                                />
                                <span className="group-hover:text-blue-600 transition-colors">{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <p className="font-medium">2. Which tool is used to take screenshots?</p>
                          <div className="space-y-2">
                            {['Paint', 'Snipping Tool', 'Calculator'].map((opt, i) => (
                              <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                  type="radio" 
                                  name="q2" 
                                  value={['a', 'b', 'c'][i]}
                                  checked={quizAnswers.q2 === ['a', 'b', 'c'][i]}
                                  onChange={(e) => setQuizAnswers({...quizAnswers, q2: e.target.value})}
                                  className="w-4 h-4 text-blue-600"
                                />
                                <span className="group-hover:text-blue-600 transition-colors">{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <button 
                          onClick={() => {
                            let score = 0;
                            if (quizAnswers.q1 === 'a') score++;
                            if (quizAnswers.q2 === 'b') score++;
                            setQuizResult(`You scored ${score} / 2`);
                          }}
                          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
                        >
                          Submit Quiz
                        </button>

                        {quizResult && (
                          <p className="text-xl font-bold text-blue-600 animate-in fade-in slide-in-from-top-2">{quizResult}</p>
                        )}
                      </div>
                    )}

                    {/* Interactive Excel Content */}
                    {currentLesson.id === 'excel-2' && (
                      <div className="mt-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <ul className="space-y-2 list-disc list-inside text-slate-700">
                          <li>Rows (1, 2, 3, 4...)</li>
                          <li>Columns (A, B, C, D...)</li>
                          <li>Cells (A1, B2 etc)</li>
                          <li>Worksheet</li>
                        </ul>
                      </div>
                    )}

                    {currentLesson.id === 'excel-3' && (
                      <div className="mt-6">
                        <p className="mb-4 font-medium text-slate-700">Practice entering numbers in the spreadsheet below:</p>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse border border-slate-300">
                            <thead>
                              <tr className="bg-slate-100">
                                <th className="border border-slate-300 p-2">A</th>
                                <th className="border border-slate-300 p-2">B</th>
                                <th className="border border-slate-300 p-2">C</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[0, 1, 2].map((row) => (
                                <tr key={row}>
                                  {[0, 1, 2].map((col) => {
                                    const idx = row * 3 + col;
                                    return (
                                      <td key={col} className="border border-slate-300 p-0">
                                        <input 
                                          type="text"
                                          value={excelTable[idx]}
                                          onChange={(e) => {
                                            const newTable = [...excelTable];
                                            newTable[idx] = e.target.value;
                                            setExcelTable(newTable);
                                          }}
                                          className="w-full p-2 text-center focus:bg-blue-50 outline-none transition-colors"
                                        />
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {currentLesson.id === 'excel-4' && (
                      <div className="mt-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <p className="mb-4 font-medium">Examples:</p>
                        <ul className="space-y-2 text-slate-700">
                          <li><code className="bg-slate-200 px-2 py-1 rounded">=A1 + B1</code> (Addition)</li>
                          <li><code className="bg-slate-200 px-2 py-1 rounded">=A1 - B1</code> (Subtraction)</li>
                          <li><code className="bg-slate-200 px-2 py-1 rounded">=SUM(A1:A5)</code> (Total)</li>
                          <li><code className="bg-slate-200 px-2 py-1 rounded">=AVERAGE(A1:A5)</code> (Average)</li>
                        </ul>
                      </div>
                    )}

                    {currentLesson.id === 'excel-5' && (
                      <div className="mt-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                        <p className="font-medium">Enter numbers and click Calculate Total:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <input 
                            type="number" 
                            placeholder="Number 1"
                            value={excelCalc.n1}
                            onChange={(e) => setExcelCalc({...excelCalc, n1: e.target.value})}
                            className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <input 
                            type="number" 
                            placeholder="Number 2"
                            value={excelCalc.n2}
                            onChange={(e) => setExcelCalc({...excelCalc, n2: e.target.value})}
                            className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <input 
                            type="number" 
                            placeholder="Number 3"
                            value={excelCalc.n3}
                            onChange={(e) => setExcelCalc({...excelCalc, n3: e.target.value})}
                            className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                        <button 
                          onClick={() => {
                            const total = Number(excelCalc.n1) + Number(excelCalc.n2) + Number(excelCalc.n3);
                            setExcelCalc({...excelCalc, result: `Total = ${total}`});
                          }}
                          className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors"
                        >
                          Calculate Total
                        </button>
                        {excelCalc.result && (
                          <p className="text-xl font-bold text-emerald-600">{excelCalc.result}</p>
                        )}
                      </div>
                    )}
                    <div className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                          {selectedCourse.icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{t.lessonOf.replace('{current}', (selectedCourse.lessons.indexOf(currentLesson) + 1).toString()).replace('{total}', selectedCourse.lessons.length.toString())}</p>
                          <p className="text-xs text-slate-500">{t.durationText.replace('{duration}', currentLesson.duration)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={handleDownloadNotes}
                          className="px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          {t.downloadNotes}
                        </button>
                        <button 
                          onClick={() => toggleLessonComplete(currentLesson.id)}
                          className={`px-6 py-3 font-bold rounded-xl transition-colors ${completedLessons.has(currentLesson.id) ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        >
                          {completedLessons.has(currentLesson.id) ? t.completed : t.markComplete}
                        </button>
                        <button 
                          onClick={() => toggleBookmark(currentLesson.id)}
                          className={`p-3 rounded-xl border border-slate-200 transition-colors ${bookmarkedLessons.has(currentLesson.id) ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-slate-400 hover:bg-slate-50'}`}
                          title={t.bookmarkLesson}
                        >
                          <Book className={`w-5 h-5 ${bookmarkedLessons.has(currentLesson.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-bold px-2">{t.courseContent}</h3>
                  <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                    {selectedCourse.lessons.map((lesson, i) => (
                      <div 
                        key={lesson.id} 
                        className={`p-4 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors ${currentLesson.id === lesson.id ? 'bg-blue-50/50' : ''}`}
                        onClick={() => setCurrentLesson(lesson)}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${currentLesson.id === lesson.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-bold ${currentLesson.id === lesson.id ? 'text-blue-600' : 'text-slate-700'}`}>{lesson.title}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{lesson.duration} MIN</p>
                        </div>
                        {completedLessons.has(lesson.id) ? <CheckCircle2 className="w-4 h-4 text-blue-600" /> : <Lock className="w-4 h-4 text-slate-300" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-slate-900 p-1.5 rounded-lg">
              <Monitor className="text-white w-4 h-4" />
            </div>
            <span className="font-bold text-lg tracking-tight">DigitalSkills</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 Digital Skills for Beginners. Empowering digital literacy for everyone.</p>
        </div>
      </footer>
      {showCertificate && selectedCourse && user && (
        <Certificate courseTitle={selectedCourse.title} userName={user.name} />
      )}
    </div>
  );
}
