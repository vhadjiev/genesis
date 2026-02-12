import { initBotId } from 'botid/client/core'

// Define the paths that need bot protection.
// The contact form is used on both /equipment and /contacts pages,
// and submits to /api/contact via POST.
initBotId({
    protect: [
        {
            path: '/api/contact',
            method: 'POST',
        },
    ],
})
