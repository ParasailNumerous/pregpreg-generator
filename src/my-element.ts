import { LitElement, css, html } from 'lit'
import { customElement, property, state, query } from 'lit/decorators.js'

/**
 * app
 */
@customElement('my-element')
export class MyElement extends LitElement {

  @state()
  image: Blob | undefined

  @query("#canvas")
  canvas!: HTMLCanvasElement

  @query("#avatar")
  avatarFileInput!: HTMLInputElement

  @query("#avatarImage")
  avatarImage!: HTMLImageElement

  @query("#imageBackground")
  imageBackground!: HTMLImageElement
  imageBackgroundSrc = `data:image/svg+xml,%3Csvg%20width%3D%22768%22%20height%3D%22768%22%20viewBox%3D%220%200%20768%20768%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M583.909%20293.931h-94.805c-38.251%200-71.104%2032.874-71.104%2071.104V768h227.285V576.939l9.75-37.376V365.035c0-38.251-32.875-71.104-71.126-71.104%22%20fill%3D%22%239268ca%22%2F%3E%3C%2Fsvg%3E`

  @query("#imageForeground")
  imageForeground!: HTMLImageElement
  imageForegroundSrc = `data:image/svg+xml,%3Csvg%20width%3D%22768%22%20height%3D%22768%22%20viewBox%3D%220%200%20768%20768%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22m633.296%20341.333%20103.467%20109.099-91.478%2096.235-.042%2064.981-84.054%2057.045-56.341-88.298%20120.427-123.947-41.366-41.024z%22%20fill%3D%22%237450a8%22%2F%3E%3Cpath%20d%3D%22m633.296%20314.667%20116.565%20121.472s40.47%2032.597%200%2071.104c-24.298%2023.104-176.554%20125.653-176.554%20125.653l-47.403-47.403L655.056%20459.84l-71.125-71.104z%22%20fill%3D%22%239268ca%22%2F%3E%3Cpath%20d%3D%22M545.68%20587.349c-23.979-11.413-46.72-9.834-68.715%203.03-10.517%206.165-14.805%2017.685%201.302%2021.504%2016.17%203.776%2067.413-24.534%2067.413-24.534%22%20fill%3D%22%23f9ca55%22%2F%3E%3Cpath%20d%3D%22M577.979%20628.245c2.965%2037.654-47.488%2072.832-85.76%2068.246-27.35-3.286-51.158-76.971-18.71-86.464%2028.928-8.448%2036.928-34.731%2071.254-24.918%2027.264%207.808%2032.128%2028.672%2033.216%2043.136%22%20fill%3D%22%23ffdc5d%22%2F%3E%3Cpath%20d%3D%22m552.677%20642.816-4.522-9.408s-16.448%2024.469-39.318%2033.92c-17.344%207.083-31.957%207.787-39.616%206.528%203.286%206.251%203.35%207.317%207.659%2011.307%2023.829.832%2061.909-11.947%2075.797-42.347m-47.296-.832c21.12-14.464%2027.286-28.288%2027.286-28.288l-6.891-8.725S501.349%20642.859%20458%20640.917c.32%205.291-.107%206.315%201.451%2011.734%205.824.192%2028.778%201.066%2045.93-10.667%22%20fill%3D%22%23ef9645%22%2F%3E%3C%2Fsvg%3E`

  @property({ type: Number })
  size = 510
  @state()
  avatarImageUrl: string | undefined

  @state()
  downloadBlob: string | undefined

  render() {
    return html`
    <main>
      <img id="avatarImage" @load="${this.avatarImageLoaded}" src="${this.avatarImageUrl}" alt="" width="128" height="128" />
      <div hidden>
      <img id="imageForeground" src="${this.imageForegroundSrc}" />
      <img id="imageBackground" src="${this.imageBackgroundSrc}" />
      </div>

      <canvas id="canvas" width="768" height="768"></canvas>
    </main>
    <aside>
    <label for="avatar">Choose a profile picture:</label>
    <input @change="${this.fileUpdated}" type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" />
    <label for="size">Set the "circle" size</label>
    <input .value=${this.size} @input="${(e: Event) => this.size = Number((e.target as HTMLInputElement).value)}" id="size" type="range" min="200" max="2000" />
    <span>${this.size}</span>
    <a
    id="downloadLink"
        download="${`pregrpeg-generator-${this.avatarFileInput?.files?.[0]?.name ?? 'avatar'}`}" ?disabled=${!this.image}
        href="${this.downloadBlob}"
        title="Download"
        aria-label="Download"
        ><button aria-hidden="true" role="presentation" inert ?disabled=${!this.image}>Download</button></a> 
    </aside>

    `
  }

  private fileUpdated() {
    if (this.avatarFileInput.files && this.avatarFileInput.files.length >= 1) {
      console.log(this.avatarFileInput.files)
      this.image = this.avatarFileInput.files[0]
      if (this.avatarImageUrl) {
        URL.revokeObjectURL(this.avatarImageUrl)
      }
      this.avatarImageUrl = URL.createObjectURL(this.image)
    }
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('size') || changedProperties.has('image')) {
      this.draw()
    }
  }

  draw() {
    if (!this.avatarImage.complete) {
      return
    }
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return
    ctx.reset()
    ctx.drawImage(this.imageBackground, 0, 0, 768, 768)
    // Elippse origined at 644 503 and growing left like a pregnant ball
    // ai

    ctx.save();
    ctx.beginPath();

    const ellipseWidth = this.size;
    const ellipseHeight = this.size;
    const centerX = 620 - (ellipseWidth / 2.1);
    const centerY = 600;

    ctx.ellipse(centerX, centerY, ellipseWidth / 2, ellipseHeight / 2, 0, 0, 2 * Math.PI);

    ctx.fillStyle = "#9268CA";
    ctx.fill();

    ctx.restore();

    // -ai
    // size is the this.size
    // x, y, w, h
    ctx.drawImage(this.imageForeground, 0, 0, 768, 768)
    ctx.drawImage(this.avatarImage, 238, 0, 448, 448)

    this.blobifyCanvas();
  }

  avatarImageLoaded() {
    // this.requestUpdate();

    this.draw();

  }

  private blobifyCanvas() {
    if (!this.image) return
    this.canvas.toBlob((blob) => {
      if (blob) {
        if (this.downloadBlob) {
          URL.revokeObjectURL(this.downloadBlob);
        }
        this.downloadBlob = URL.createObjectURL(blob);
        console.log(this.downloadBlob)
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.avatarImageUrl) URL.revokeObjectURL(this.avatarImageUrl);
    if (this.downloadBlob) URL.revokeObjectURL(this.downloadBlob);
  }

  static styles = css`
  :host {
    
  }
  :host, main, aside {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    }
    main {
      max-width: 32rem;
          min-width: 0;
      flex: 0 1 50%;
    }
    input {
      max-width: 32rem;
    }
    #downloadLink {
      width: fit-content;
    }
      #downloadLink button {
            font-size: 3rem;
      }
    @media (min-width: 720px) {
        :host {
            flex-direction: row;
        }
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement
  }
}
