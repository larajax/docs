export default {
    title: 'Larajax',
    description: 'AJAX for Laravel, without the boilerplate',
    head: [
        ['link', { rel: 'icon', href: '/favicon.svg' }]
    ],
    themeConfig: {
        logo: '/favicon.svg',
        nav: [
            { text: 'Guide', link: '/guide/getting-started' },
            { text: 'Reference', link: '/api/reference' },
            { text: 'GitHub', link: 'https://github.com/larajax/larajax' }
            // { text: 'Features', link: '/guide/api' },
        ],
        sidebar: {
            '/guide/': [
                { text: 'Getting Started', link: '/guide/getting-started' },
                { text: 'Working with Data', link: '/guide/working-with-data' },
                { text: 'Working with Query', link: '/guide/working-with-query' },
                { text: 'Controller Integration', link: '/guide/controller-integration' },
                { text: 'Defining Components', link: '/guide/defining-components' }
                // { text: 'API', link: '/api/api' }
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
