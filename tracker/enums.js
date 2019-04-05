const listOfSitesToFollow = [
    'google.com',
    'google.co.il',
    'facebook.com'
];

const enums = {
    listOfSitesToFollow: listOfSitesToFollow
};

chrome.storage.sync.set({enums: enums});

