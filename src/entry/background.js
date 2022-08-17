const DOMParser = require('xmldom').DOMParser

function parseRSS2(doc) {
    const title = doc.getElementsByTagName('title')[0].firstChild.nodeValue
    const link = doc.getElementsByTagName('link')[0].firstChild.nodeValue
    const list = []

    const entries = doc.getElementsByTagName('item')
    for (let i = 0; i < entries.length; i++) {

        const entry = entries[i]
        const json = { read: false }

        json.id = entry.getElementsByTagName('guid')[0].firstChild.nodeValue
        json.title = entry.getElementsByTagName('title')[0].firstChild.nodeValue
        json.source = title
        json.link = entry.getElementsByTagName('link')[0].firstChild.nodeValue

        if (entry.getElementsByTagName('content:encoded').length > 0) {
            json.summary = entry.getElementsByTagName('content:encoded')[0].firstChild.nodeValue
        } else {
            json.summary = entry.getElementsByTagName('description')[0].firstChild.nodeValue
        }
        const eDate = entry.getElementsByTagName('pubDate')[0].firstChild.nodeValue
        json.date = new Date(eDate).getTime()

        list.push(json)
    }

    return {
        title: title, url: link, entries: list
    }
}

function parseATOM1(doc) {
    const title = doc.getElementsByTagName('title')[0].firstChild.nodeValue
    const link = doc.getElementsByTagName('link')[0].getAttribute('href')
    const list = []

    const entries = doc.getElementsByTagName('entry')
    for (let i = 0; i < entries.length; i++) {

        const entry = entries[i]
        const json = { read: false }

        json.id = entry.getElementsByTagName('id')[0].firstChild.nodeValue
        json.title = entry.getElementsByTagName('title')[0].firstChild.nodeValue
        json.source = title
        json.link = entry.getElementsByTagName('link')[0].getAttribute('href')

        if (entry.getElementsByTagName('content').length > 0) {
            json.summary = entry.getElementsByTagName('content')[0].firstChild.nodeValue
        } else {
            json.summary = entry.getElementsByTagName('summary')[0].firstChild.nodeValue
        }
        const eDate = entry.getElementsByTagName('published')[0].firstChild.nodeValue
        json.date = new Date(eDate).getTime()

        list.push(json)
    }

    return {
        title: title, url: link, entries: list
    }
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log("Request: " + request.action)

        if (request.action === "fetch") {
            fetchFeed(request.url)
                .then(parsed => persistFeed(parsed))
                .then(persisted => sendResponse(persisted))
                .catch(e => {
                    sendResponse(null)
                    chrome.runtime.sendMessage(
                        { action: "error", message: e.toString() }
                    )
                })
        }
        return true;
    }
)

async function fetchFeed(url) {

    const resp = await fetch(url)
    if (! resp.ok) {
        throw new Error("Can't connect to " + url + " : " + resp.status)
    }

    const xml = await resp.text()
    const doc = new DOMParser({
        locator: {},
        errorHandler: {
            error: (msg) => { throw new Error("Can't parse the Xml document.") }
        }
    }).parseFromString(xml, 'text/xml')

    return new Promise((resolve) => {
        if (doc.getElementsByTagName('rss').length > 0) {
            resolve(parseRSS2(doc))
        }
        else if (doc.getElementsByTagName('feed').length > 0) {
            resolve(parseATOM1(doc))
        } 
        else {
            throw new Error("The Xml document is not RSS nor ATOM feed.")
        }
    })
}

async function persistFeed(payload) {
    return new Promise((resolve) => {
        chrome.storage.local.get('entries', function (store) {
            if (!store.entries) {
                store.entries = payload.entries
            } else {
                for (let i = 0; i < payload.entries.length; i++) {
                    const curr = payload.entries[i].id

                    if (!store.entries.find(e => e.id === curr)) {
                        store.entries.push(payload.entries[i])
                    }
                }
            }
            store.entries.sort(function (a, b) {
                return (b.date - a.date)
            })
            payload.entries = store.entries
            chrome.storage.local.set(payload)
            resolve(payload)
        })
    })
}