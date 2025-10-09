export default {
    title: 'Larajax',
    description: 'AJAX for Laravel, without the boilerplate',
    head: [
        ['link', { rel: 'icon', href: '/favicon.svg' }]
    ],
    themeConfig: {
        logo: '/favicon.svg',
        nav: [
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Features', link: '/guide/api' },
            { text: 'API Handbook', link: '/guide/api' },
            { text: 'GitHub', link: 'https://github.com/larajax/larajax' }
        ],
        sidebar: {
            '/guide/': [
                { text: 'Getting started', link: '/guide/getting-started' },
                { text: 'Examples', link: '/examples/examples' },
                { text: 'API', link: '/api/api' }
                // { text: 'Security', link: '/guide/security' },
                // { text: 'FAQ', link: '/guide/faq' }
            ]
        },
        socialLinks: [
            { icon: 'github', link: 'https://github.com/larajax/larajax' }
        ],
        search: { provider: 'local' }
    }
}
