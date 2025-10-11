import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { pool } from "./db.js";
import dotenv from "dotenv";

dotenv.config();

// Debugging environment variables

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log(profile);
        const email =profile.emails?.[0]?.value;
        const name = profile.displayName || profile.name?.givenName || "Google User";

        if (!email) return done(new Error("No email in Google profile"), null);

        const [rows] = await pool.query("SELECT * FROM users WHERE email=?", [email]);
        let user;

        if (rows.length > 0) {
            user = rows[0];
        } else {
            const [result] = await pool.query(
                "INSERT INTO users (name, email, role is_verified, created_at) VALUES (?, ?, ?)",
                [name, email, "customer"]
            );
            user = { user_id: result.insertId, name, email, role: "customer",is_verified:1 };
        }
        console.log(user);
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => done(null, user.user_id));
passport.deserializeUser(async (id, done) => {
    try {
        const [rows] = await pool.query("SELECT * FROM users WHERE user_id=?", [id]);
        done(null, rows[0]);
    } catch (err) {
        done(err, null);
    }
});

export default passport;
