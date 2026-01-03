export const settings = {
  pageHeader: {
    title: "Settings",
    subtitle: "Configure your Audiobookshelf server connection",
  },

  step1: {
    title: "Step 1: CORS Configuration",
    description:
      "Before we can connect to your server, we need to ensure the browser allows the connection. This is done via CORS (Cross-Origin Resource Sharing).",

    corsInfo: {
      title: "What is CORS and why do I need it?",
      definition:
        "<strong>CORS (Cross-Origin Resource Sharing)</strong> is a security feature built into all modern web browsers. Think of it as a permission system that protects your server from being accessed by random websites without your explicit approval.",
      browserSecurity:
        "When you visit a website, your browser normally blocks that website from making requests to other servers. This is a safety measure to prevent malicious websites from accessing your private data or servers without permission.",
      toolboxExplanation:
        "This toolbox runs entirely in your browser, and needs to communicate with your Audiobookshelf server. To allow this, you need to tell your server: \"It's okay, I trust this toolbox to connect to you.\" That's what adding the CORS URL does.",
      safetyTitle: "Is this safe?",
      safetyIntro:
        "Yes, (although that is funny to say as the website you enter this information, isn't it?):",
      safetyReasons: [
        "Your browser makes the requests directly to your server.",
        "Your API token is stored only in your browser's local storage",
        "You can verify all network requests using your browser's developer tools (press F12).",
        "The source code is open and available for inspection on GitHub.",
      ],
      privacyNote:
        "This toolbox is designed with privacy in mind. Your data never leaves your browser except to communicate directly with your own Audiobookshelf server. This setting just allows to make that direct connection possible. It does not mean this toolbox can access your server without your credentials.",
    },

    instructions: {
      addUrl:
        "Please add the following URL to your Audiobookshelf server's CORS settings:",
      copyButton: "Copy",
      imageAlt: "CORS Settings Location",
    },

    buttons: {
      next: "Next: Server URL",
    },
  },

  step2: {
    title: "Step 2: Server Connection",
    description: "Enter the URL of your Audiobookshelf server.",

    serverInfo: {
      title:
        "<strong>Important:</strong> Your server does NOT need to be accessible from the internet. It only needs to be reachable from this browser.",
      localExample:
        'For example, if your server runs on your local network at <code class="text-white">http://192.168.1.100:13378</code>, you can use that address. The connection is made directly from your browser to your server - no data passes through any external service or third-party server.',
      directConnection:
        "All communication happens directly between your browser and your Audiobookshelf server. This toolbox website acts only as the interface. Instead of showing your library, it uses the same API your server provides to make the tools work.",
    },

    form: {
      serverUrlLabel: "Server URL",
      serverUrlPlaceholder: "https://example.com",
      checkConnectionButton: "Check Connection",
    },

    errors: {
      invalidUrl: "Please enter a valid URL",
      connectionFailedTitle: "Connection Failed",
      corsHint: "This looks like a CORS error. Please double-check Step 1.",
      couldNotConnect:
        "Could not connect to server. This might be due to CORS or the server being unreachable.",
      serverError: "Server returned error: {status} {statusText}",
    },

    buttons: {
      back: "Back",
      checkConnection: "Check Connection",
    },
  },

  step3: {
    title: "Step 3: Authentication",
    description: "Enter your API Token to authenticate with your server.",

    privacyInfo: {
      title:
        "<strong>Privacy Note:</strong> Your API token is stored only in your browser's local storage and is being used to connect to the server you entered in step 2. It is not sent to any external servers - only to your Audiobookshelf server when making authorized requests.",
      tokenPurpose:
        "The token is used to prove your identity to your server. Without it, the toolbox cannot access your library or make any changes.",
    },

    apiKeyGeneration: {
      text: "You can generate an API key at:",
      path: "{url}/config/api-keys",
      imageAlt: "API Token Generation",
    },

    form: {
      apiTokenLabel: "API Token",
      apiTokenPlaceholder: "Paste your API token here",
      verifyButton: "Verify & Save",
    },

    errors: {
      invalidToken: "Invalid token. Please check and try again.",
      verifyFailed: "Failed to verify token. Please try again.",
    },

    buttons: {
      back: "Back",
      verify: "Verify & Save",
    },
  },
};
