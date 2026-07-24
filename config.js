/* =========================================================================
   CODE HIVE BRIDGE — EDIT THIS FILE, NOT script.js
   Everything you need to change to make this site yours lives here.
   ========================================================================= */

const SITE_CONFIG = {
  // ---- Your payment details (shown inside the "Buy via UPI" popup) ----
  upiId: "8495879228@ybl",          // <-- your real UPI ID, e.g. "codehivebridge@okaxis"
  payeeName: "Code Hive Bridge",    // shows in the UPI app when someone pays

  // ---- How buyers reach you after paying ----
  whatsappNumber: "918495879228",   // <-- country code + number, no +, no spaces, no dashes
  contactEmail: "bytebridge393@gmail.com", // <-- your real email

  // ---- Free-download flow (used by the "Get free download" popup) ----
  youtubeChannelName: "Code Hive Bridge",             // <-- shown as "Subscribe to ___"
  youtubeUrl: "https://www.youtube.com/@CodeHiveBridge" // <-- your real channel URL
};

/* =========================================================================
   PROJECT LIST
   -------------------------------------------------------------------------
   Replace/extend this array with your real 80+ projects. Each project needs:
   id        - unique short string, no spaces
   title     - project name shown on the card
   stack     - one of: "html", "css", "js", "python", "php", "mysql"
               (pick the PRIMARY stack — you can add more in `tags`)
   tags      - array of extra stack labels shown as small pills
   summary   - 1-2 sentence description
   price     - 0 for free, or a number in INR for paid (e.g. 499)
   ========================================================================= */

const PROJECTS = [
  {
    id: "voice-html-css-js",
    title: "Voice Scribe — Speech to Text",
    stack: "js",
    tags: ["html", "css"],
    summary: "A single-page voice-to-text tool: tap the mic, talk, and watch your words appear live in a readable transcript — powered by a real-time circular waveform that reacts to your actual microphone volume.",
    price: 0
  },
  {
    id: "resume-template",
    title: "Resume Builder",
    stack: "html",
    tags: ["css"],
    summary: "A single-page, client-side resume builder — fill in a form on the left, watch a live resume preview render on the right, pick from 6 professional templates, and export the result straight to PDF.",
    price: 0
  },
  {
    id: "wish_weaver",
    title: "Wish Weaver — Birthday Card Maker",
    stack: "html",
    tags: ["css"],
    summary: "A single-page birthday card generator: fill in a name, relationship, and tone, pick an animated style, and get a unique animated card every time. Download it as a PNG snapshot or as an animated GIF that captures the motion.",
    price: 0
  },
  {
    id: "camera_alert",
    title: "Camera Alert",
    stack: "python",
    tags: ["html", "css"],
    summary: "A Python application that watches your webcam and, the moment a person's face appears in front of the camera, captures a snapshot and instantly emails it to you.",
    price: 1
  }

  // Add the rest of your 80+ projects below, same shape as above:
  // {
  //   id: "unique-id-here",
  //   title: "Project Name",
  //   stack: "html" | "css" | "js" | "python" | "php" | "mysql",
  //   tags: ["extra", "stacks"],
  //   summary: "Short description of what it does.",
  //   price: 0
  // },
];
