/* =========================================================================
   CODE HIVE BRIDGE — EDIT THIS FILE, NOT script.js
   Everything you need to change to make this site yours lives here.
   ========================================================================= */

const SITE_CONFIG = {
  // ---- Your payment details (shown inside the "Buy via UPI" popup) ----
  upiId: "8495879228@ybl",          // <-- put your real UPI ID here, e.g. "codehivebridge@okaxis"
  payeeName: "Code Hive Bridge",  // shows in the UPI app when someone pays

  // ---- How buyers reach you after paying ----
  whatsappNumber: "918495879228", // <-- country code + number, no +, no spaces, no dashes
  contactEmail: "bytebridge393@gmail.com" // <-- your real email
};

/* =========================================================================
   PROJECT LIST
   -------------------------------------------------------------------------
   This is placeholder/sample data so the site works out of the box.
   Replace this array with your real 80+ projects. Each project needs:

   id        - unique short string, no spaces
   title     - project name shown on the card
   stack     - one of: "html", "css", "js", "python", "php", "mysql"
               (pick the PRIMARY stack — you can add more in `tags`)
   tags      - array of extra stack labels shown as small pills
   summary   - 1-2 sentence description
   price     - 0 for free, or a number in INR for paid (e.g. 499)
   freeUrl   - direct download link for FREE projects
               (a GitHub repo URL, a zip on Google Drive, etc.) — leave ""
               for paid projects, it's not used
   ========================================================================= */

const PROJECTS = [
  {
    id: "voice-html-css-js",
    title: "Voice Scribe — Speech to Text",
    stack: "js",
    tags: ["html", "css"],
    summary: "A single-page voice-to-text tool: tap the mic, talk, and watch your words appear live in a readable transcript — powered by a real-time circular waveform that reacts to your actual microphone volume.",
    price: 0,
    freeUrl: "https://github.com/codehivebridge/Voice-Scribe-Speech-to-Text"
  },
  {
    id: "resume-template",
    title: "Resume Builder",
    stack: "html",
    tags: ["css"],
    summary: "A single-page, client-side resume builder — fill in a form on the left, watch a live resume preview render on the right, pick from 6 professional templates, and export the result straight to PDF.",
    price: 0,
    freeUrl: "https://github.com/codehivebridge/Resume-Builder"
  },
  {
    id: "wish_weaver",
    title: "Wish Weaver — Birthday Card Maker",
    stack: "html",
    tags: ["css"],
    summary: "A single-page birthday card generator: fill in a name, relationship, and tone, pick an animated style, and get a unique animated card every time. Download it as a PNG snapshot or as an animated GIF that captures the motion.",
    price: 0,
    freeUrl: "https://github.com/codehivebridge/Wish-Weaver"
  },
   {
    id: "camera_alert",
    title: "Camera Alert",
    stack: "python",
    tags: ["html, css"],
    summary: "A Python application that watches your webcam and, the moment a person's face appears in front of the camera, captures a snapshot and instantly emails it to you.",
    price: 1,
    freeUrl: "https://github.com/codehivebridge/Camera-Alert"
  }
];
