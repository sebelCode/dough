// General loading stuff
const fonts = [
    ["kurokane", "fonts/kurokane.otf"],
    ["seurat", "fonts/seurat.otf"]
]

// Load a JSON file
export function loadJSON(path) {
    return new Promise((resolve, reject) => {

        fetch(path).then(f => {
            f.json()
            .then(json => resolve(json))
            //.catch(reject(`Failed to load JSON ${path}`))
        })

    })
}

// Load a .txt file
export function loadTxt(path) {
    return new Promise((resolve, reject) => {

        fetch(path).then(f => {
            f.text()
            .then(txt => resolve(txt))
            //.catch(reject(`Failed to load TXT ${path}`))
        })

    })
}

// Loads an image
export function loadImage(path) {
    return new Promise(resolve => {
        const img = new Image()
        img.addEventListener("load", () => resolve(img))
        img.src = path
    })
}

// Returns a dictionary where each key is a path and each value is an asset
export function loadAssets(paths) {

    return new Promise((resolve, reject) => {

        // Record each loading promise
        var promises = []

        for (let i = 0; i < paths.length; i++) {
            const path = paths[i]
            var promise
            
            //console.log(`Started loading ${path}..`)
            if (path.endsWith(".json")) {
                promise = loadJSON(path)
            }
            if (path.endsWith(".png")) {
                promise = loadImage(path)
            }

            promises.push(promise)

        }

        // Link each asset to its path in a dictionary and resolve the promise
        Promise.all(promises).then(v => {

            var loaded = {}
            
            for (let i = 0; i < paths.length; i++) {
                const path = paths[i]
                loaded[path] = v[i]
            }
            resolve(loaded)
        })

    })

}

export async function loadFonts() {

    for (let i = 0; i < fonts.length; i++) {
        const name = fonts[i][0]
        const url = fonts[i][1]

        const font = new FontFace(name, `url("${url}")`);
        document.fonts.add(font);
        font.load()
        
    }

    await document.fonts.ready
    
}