# LivePapers

Okay so this was originally gonna be a straight forward A level resource hub website but I thought that thats too generic
so I'm taking a spin on the tradidtional formula by making it into a web os centered around A level resources

## Project Structure

### Backend
app/api/:
- [...next]/
    - route.js auth dynamic route
- signup/
    - route.js signup route

##### how auth works:
User signup -> signup with google? -> if account doesnt exist we ask them to create one and link with google on creation -> push user to dashboard
The next time the user logs in, they can seamlessly login with google

the reset_db.js script was made to test this

### Frontend
app/ (frontend for respective pages):
- auth/
    - login/
        - page.js
    - signup/
        - page.js
- LandingPage/
    - page.js
- dashboard/
    - page.js - where the web os lives

- components/
    - dashboard/ 
        - AppWindow.jsx (for the "apps")
        - SettingsApp.jsx (the local system settings app component)
        - AppSwitcherCard.jsx (cards in app switcher, lets u swipe up to close)
        - MobileAppSwitcher.jsx (holds the running apps on mobile switcher)
        - DesktopDock.jsx (desktop dock + bottom bar)
        - IconGrid.jsx (icon grids for both mobile/desktop, includes swiping logic)
    - LandingPage/
        - FeatureCard.jsx
        - Features.jsx
        - Footer.jsx
        - Hero.jsx
        - Navbar.jsx
        all pretty self explanatory components 
    - Button.jsx : my signature custom Button component, I use it everywhere
    - Providers.js session provider wrapper
- lib/
    - mongodb.js mongodb connection file
- models/
    - User.js users collection model/schema




### Tech Stack:
- Next.js (app router)
- Next Auth (with Google OAuth)
- Next API routes (for all backend requests)
- MongoDB (using mongodb driver, NOT mongoose)
- Tailwind CSS
- GSAP (for animations)


### AI Usage
AI was used to:
- debug
- write complex code (especially backend/auth)
It was NOT used to:
- write the readme
- come up with new features/ideas (Although I do acknowldge it did come up with better UI designs then what I intially had planned)