// Code for drawing BRCAD/BCCAD cellanim data
// Check flour out on GitHub at https://github.com/patataofcourse/flour
// (not sponsored)

const debug = false

// Represents a BRCAD or BCCAD file
export class Brcad {

    constructor(json, img) {

        this.img = img
        console.log(json)

        this.sprites = json.data.sprites
        this.animations = json.data.animations

    }

    drawSprite(index, ctx, transform) {

        const sprite = this.sprites[index]
        const parts = sprite.parts 

        for (let i = 0; i < parts.length; i++) {

            const part = parts[i]

            const sx = part.texture_pos.x
            const sy = part.texture_pos.y
            const sw = part.texture_pos.width
            const sh = part.texture_pos.height

            // Absolute width
            var abs_width = sw
            var abs_height = sh

            // Apply position and scale
            ctx.setTransform(transform)
            if (debug) ctx.fillRect(0, 0, 10, 10)
            ctx.transform(1, 0, 0, 1, part.pos_x, part.pos_y)

            // Convert the angle to radians
            const angle = (Math.PI/180) * part.rotation
            // Move the top left corner of the part to where its centre should be
            ctx.transform(1, 0, 0, 1, abs_width/2, abs_height/2)
            // Rotate it at the new position
            ctx.rotate(angle)
            // Move the top left corner back except with rotation applied, therefore causing the part to be rotated from its centre
            ctx.transform(1, 0, 0, 1, abs_width/-2, abs_height/-2)

            // Flip X or Y from the centre if the data says so
            //const rotation = part.rotation
            if (part.flip_x) {
                ctx.transform(-1, 0, 0, 1, abs_width, 0)
                //rotation += 180
            }
            if (part.flip_y) {
                ctx.transform(-1, 0, 0, 1, abs_height, 0)
                //rotation += 180
            }

            // Show the sprite's pivot and rectangular region area if in debug mode
            if (debug) {
                ctx.strokeRect(0, 0, sw * part.scale_x, sh * part.scale_y)
                ctx.fillRect(-2, -2, 4, 4)
            }
            
            // I think this is good
            ctx.drawImage(this.img, sx, sy, sw, sh, 0, 0, sw * part.scale_x, sh * part.scale_y)
            
        }

    }

    // Returns which step object should be shown at a certain frame of the animation. Accounts for the fact that certain steps can be multiple frames long
    getAnimStepAt(index, frame) {

        const anim = this.animations[index]
        const steps = anim.steps

        // Which frame a step starts at
        const points = {}

        // Record when each step starts
        var currentFrame = 0
        for (let i = 0; i < steps.length; i++) {
            points[currentFrame] = steps[i]
            currentFrame += steps[i].duration
        }

        // Find the latest step that starts before frame
        const framepoints = Object.keys(points)

        for (let i = 0; i < framepoints.length; i++) {
            const point0 = Number(framepoints[i])
            const point1 = Number(framepoints[i + 1])

            if (frame < point1 && frame >= point0) {
                const step = steps[point0]
                return step
            }

        }

    }

    drawAnimation(index, frame, ctx, transform) {

        /*
        {
            "sprite": 4,
            "duration": 4,
            "unk0": 0,
            "scale_x": 1,
            "scale_y": 1,
            "rotation": 0,
            "opacity": 255,
            "unk1": [
                0,
                0,
                0
            ]
        }
        */

        const anim = this.animations[index]
        const step = this.getAnimStepAt(index, frame)

        if (step == null) {
            console.log(`[!] Animation ${index} frame ${frame} does not exist`, anim)
            return
        }

        // Get the new transform
        ctx.setTransform(transform)
        const angle = (Math.PI/180) * step.rotation
        ctx.rotate(angle)
        ctx.transform(step.scale_x, 0, 0, step.scale_y, 0, 0)
        transform = ctx.getTransform()

        this.drawSprite(step.sprite, ctx, transform)
        

    }

}

export function drawAnimStep(step, img, ctx, transform) {
    console.log(step)
}