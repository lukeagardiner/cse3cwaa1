// app/page2.tsx
import HamburgerMenu from './Components/HamburgerMenu';
import TabMenu from './Components/TabMenu';

export default function Home() {
    return (
        <div>
            <HamburgerMenu />
            <TabMenu />
            <h1>Welcome to My Next.js App</h1>
        </div>
    )
}