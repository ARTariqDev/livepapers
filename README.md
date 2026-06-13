# LivePapers

Okay so this was originally gonna be a straight forward A level resource hub website but I thought that thats too generic
so I'm taking a spin on the tradidtional formula by making it into a web os entered around A level resources

# Project Structure

app/api/:
- next auth dynamic route
- signup


app/ (frontend for respective pages):
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
        - AppWindow (for the "apps")
    - LandingPage/
        - FeatureCard.jsx
        - Features.jsx
        - Footer.jsx
        - Hero.jsx
        - Navbar.jsx
        all self explanatory
    - Button: my signature custom Button component, I use it everywhere
    - Providers.js session provider wrapper
- lib/
    - mongodb.js mongodb connection file
- models/
    - User.js users collection model/schema

# how auth works:
User signup -> signup with google? -> if account doesnt exist we ask them to create one and link with google on creation -> push user to dashboard
The next time the user logs in, they cans eamlessly login with google

the reset_db.js script was made to test this
