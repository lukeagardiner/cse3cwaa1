export default function AboutPage() {
    return (
        <section style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem'}}>
            <h1 style={{ fontSize: '2rem', lineHeight: 1.2, fontWeight: 800, margin: '0 0 .75rem', textAlign: 'center'}}>
                Welcome to our WebApp - Who are we and how do I do things will all be answered here!
            </h1>
            <h2 style={{ fontSize: '1.5rem', lineHeight: 1.3, fontWeight: 700, margin: '2rem 0 .5rem', textAlign: 'center' }}>
                Application Author
            </h2>
            <dl style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '0.5rem 1.25rem' }}>
                <dt style={{ fontWeight: 600 }}>Name</dt>
                <dd>Luke Gardiner</dd>
                <dt style={{ fontWeight: 600 }}>Student No.</dt>
                <dd>20219568</dd>
                <dt style={{ fontWeight: 600 }}>Email</dt>
                <dd>20219568@students.latrobe.edu.au</dd>
            </dl>

            <h2 style={{ fontSize: '1.5rem', lineHeight: 1.3, fontWeight: 700, margin: '2rem 0 .5rem', textAlign: 'center' }}>
                How to use this site (Video)
            </h2>
            <figure style={{ margin: 0 }}>
                <video
                    controls
                    preload="metadata"
                    playsInline
                    style={{
                        display: 'block',
                        width: '100%',
                        borderRadius: 8,
                        border: '1px solid var(--border, #d0d7de)',
                        background: '#000'
                    }}
                    aria-label="How to use this site video turorial"
                >
                    <source src="/videos/howto.mp4" type="video/mp4" />
                    Sorry, your browser doesn't support embedded videos. You can download the video here:
                    <a href='/videos/howto.mp4'>Download MP4</a>
                </video>
                <figcaption style={{ marginTop: '0.5rem', color: '#666', textAlign: 'center' }}>
                    Having trouble? <a href='/videos/howto.mp4'>Download the MP4</a>
                </figcaption>
            </figure>
        </section>
    );
}