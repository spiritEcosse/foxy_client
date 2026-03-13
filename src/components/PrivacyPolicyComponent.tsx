import * as React from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';
import { Helmet } from 'react-helmet-async';

export default function PrivacyPolicyComponent() {
    return (
        <>
            <Helmet>
                <title>Privacy Policy</title>
                <meta
                    name="description"
                    content="Our privacy policy explains how we collect, use, and protect your personal information."
                />
            </Helmet>
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Typography variant="h1" gutterBottom>
                    Privacy Policy
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Last updated: March 9, 2026
                </Typography>
                <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
                    <Box component="section" sx={{ mb: 4 }}>
                        <Typography variant="h2" gutterBottom>
                            1. Introduction
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Welcome to our website. We are committed to protecting your personal
                            information and your right to privacy. This Privacy Policy explains how
                            we collect, use, disclose, and safeguard your information when you
                            visit our website or make a purchase from us.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Please read this policy carefully. If you disagree with its terms,
                            please discontinue use of our site.
                        </Typography>
                    </Box>

                    <Box component="section" sx={{ mb: 4 }}>
                        <Typography variant="h2" gutterBottom>
                            2. Information We Collect
                        </Typography>
                        <Typography variant="body1" paragraph>
                            We collect information that you provide directly to us, including:
                        </Typography>
                        <Typography component="ul" variant="body1" sx={{ pl: 3 }}>
                            <li>Name, email address, and password when you create an account</li>
                            <li>Billing and shipping address for order fulfillment</li>
                            <li>Payment information (processed securely; we do not store full card details)</li>
                            <li>Order history and purchase details</li>
                            <li>Communications you send us (support requests, feedback)</li>
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                            We also automatically collect certain information when you use our
                            site, such as IP address, browser type, pages visited, and referring
                            URLs, through cookies and similar tracking technologies.
                        </Typography>
                    </Box>

                    <Box component="section" sx={{ mb: 4 }}>
                        <Typography variant="h2" gutterBottom>
                            3. How We Use Your Information
                        </Typography>
                        <Typography variant="body1" paragraph>
                            We use the information we collect to:
                        </Typography>
                        <Typography component="ul" variant="body1" sx={{ pl: 3 }}>
                            <li>Process and fulfill your orders</li>
                            <li>Send order confirmations and shipping updates</li>
                            <li>Respond to your comments and questions</li>
                            <li>Send marketing communications (only with your consent)</li>
                            <li>Improve and optimize our website and services</li>
                            <li>Detect and prevent fraudulent transactions</li>
                            <li>Comply with legal obligations</li>
                        </Typography>
                    </Box>

                    <Box component="section" sx={{ mb: 4 }}>
                        <Typography variant="h2" gutterBottom>
                            4. Sharing Your Information
                        </Typography>
                        <Typography variant="body1" paragraph>
                            We do not sell, trade, or rent your personal information to third
                            parties. We may share your information with:
                        </Typography>
                        <Typography component="ul" variant="body1" sx={{ pl: 3 }}>
                            <li>
                                <strong>Service providers</strong> — payment processors, shipping
                                carriers, and hosting providers who assist in operating our
                                business, subject to confidentiality agreements
                            </li>
                            <li>
                                <strong>Legal authorities</strong> — when required by law or to
                                protect our rights, property, or safety
                            </li>
                            <li>
                                <strong>Business transfers</strong> — in connection with a merger,
                                acquisition, or sale of assets, with prior notice to you
                            </li>
                        </Typography>
                    </Box>

                    <Box component="section" sx={{ mb: 4 }}>
                        <Typography variant="h2" gutterBottom>
                            5. Pinterest and Third-Party Services
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Our website may use Pinterest widgets, tags, or other integrations.
                            When you interact with Pinterest features on our site, Pinterest may
                            collect information about you in accordance with their own{' '}
                            <a
                                href="https://policy.pinterest.com/en/privacy-policy"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Privacy Policy
                            </a>
                            . We use the Pinterest conversion tag to measure the effectiveness of
                            our advertising campaigns and to serve relevant ads to users of
                            Pinterest.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Pinterest's advertising and analytics services allow us to understand
                            how users interact with our content after viewing our Pinterest ads.
                            Information collected may include device identifiers, cookie
                            identifiers, and browsing behavior. This data is used solely to
                            understand our Pinterest campaigns on an anonymous basis and is not
                            shared with other third parties or combined with personally
                            identifiable information.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            <strong>Your consent:</strong> By using our website, you consent to
                            your information being shared with Pinterest for online behavioral
                            advertising purposes. You may opt out at any time via your{' '}
                            <a
                                href="https://www.pinterest.com/settings/privacy"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Pinterest account settings
                            </a>
                            ,{' '}
                            <a
                                href="https://optout.aboutads.info/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Digital Advertising Alliance opt-out
                            </a>
                            , or{' '}
                            <a
                                href="https://optout.networkadvertising.org/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Network Advertising Initiative opt-out
                            </a>
                            .
                        </Typography>
                        <Typography variant="body1" paragraph>
                            <strong>Data retention:</strong> Any data received from Pinterest
                            tied to unique identifiers is deleted no later than 6 months after
                            receipt, in accordance with Pinterest's advertising guidelines.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            <strong>Prohibited data:</strong> We do not collect or share with
                            Pinterest any sensitive information including health conditions, race,
                            religion, sexual orientation, political affiliation, precise
                            geolocation, financial details, government IDs, or data from children
                            under 13.
                        </Typography>
                    </Box>

                    <Box component="section" sx={{ mb: 4 }}>
                        <Typography variant="h2" gutterBottom>
                            6. Cookies
                        </Typography>
                        <Typography variant="body1" paragraph>
                            We use cookies and similar tracking technologies to enhance your
                            experience on our site. Cookies are small data files stored on your
                            device. We use:
                        </Typography>
                        <Typography component="ul" variant="body1" sx={{ pl: 3 }}>
                            <li>
                                <strong>Essential cookies</strong> — necessary for the website to
                                function (e.g., shopping cart, login session)
                            </li>
                            <li>
                                <strong>Analytics cookies</strong> — to understand how visitors
                                use our site (e.g., page views, traffic sources)
                            </li>
                            <li>
                                <strong>Advertising cookies</strong> — to deliver relevant
                                advertisements and measure campaign performance (including
                                Pinterest tags)
                            </li>
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                            You can control cookies through your browser settings. Disabling
                            certain cookies may affect site functionality.
                        </Typography>
                    </Box>

                    <Box component="section" sx={{ mb: 4 }}>
                        <Typography variant="h2" gutterBottom>
                            7. Data Retention
                        </Typography>
                        <Typography variant="body1" paragraph>
                            We retain your personal information for as long as necessary to fulfill
                            the purposes outlined in this policy, comply with legal obligations,
                            resolve disputes, and enforce our agreements. Account data is retained
                            for the duration of your account, plus a reasonable period thereafter.
                        </Typography>
                    </Box>

                    <Box component="section" sx={{ mb: 4 }}>
                        <Typography variant="h2" gutterBottom>
                            8. Your Rights
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Depending on your location, you may have the following rights regarding
                            your personal data:
                        </Typography>
                        <Typography component="ul" variant="body1" sx={{ pl: 3 }}>
                            <li>
                                <strong>Access</strong> — request a copy of the personal data we
                                hold about you
                            </li>
                            <li>
                                <strong>Correction</strong> — request correction of inaccurate or
                                incomplete data
                            </li>
                            <li>
                                <strong>Deletion</strong> — request deletion of your personal data
                                (subject to legal requirements)
                            </li>
                            <li>
                                <strong>Opt-out of marketing</strong> — unsubscribe from marketing
                                emails at any time via the unsubscribe link
                            </li>
                            <li>
                                <strong>Data portability</strong> — receive your data in a
                                structured, machine-readable format
                            </li>
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                            To exercise any of these rights, please contact us at the address below.
                        </Typography>
                    </Box>

                    <Box component="section" sx={{ mb: 4 }}>
                        <Typography variant="h2" gutterBottom>
                            9. Children's Privacy
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Our website is not directed to children under the age of 13. We do not
                            knowingly collect personal information from children. If you believe we
                            have inadvertently collected such information, please contact us so we
                            can promptly remove it.
                        </Typography>
                    </Box>

                    <Box component="section" sx={{ mb: 4 }}>
                        <Typography variant="h2" gutterBottom>
                            10. Security
                        </Typography>
                        <Typography variant="body1" paragraph>
                            We implement industry-standard security measures to protect your
                            personal information against unauthorized access, alteration,
                            disclosure, or destruction. However, no method of transmission over the
                            internet or electronic storage is 100% secure, and we cannot guarantee
                            absolute security.
                        </Typography>
                    </Box>

                    <Box component="section" sx={{ mb: 4 }}>
                        <Typography variant="h2" gutterBottom>
                            11. Changes to This Policy
                        </Typography>
                        <Typography variant="body1" paragraph>
                            We may update this Privacy Policy from time to time. We will notify you
                            of any significant changes by posting the new policy on this page with
                            an updated "Last updated" date. We encourage you to review this policy
                            periodically.
                        </Typography>
                    </Box>

                    <Box component="section">
                        <Typography variant="h2" gutterBottom>
                            12. Contact Us
                        </Typography>
                        <Typography variant="body1" paragraph>
                            If you have any questions about this Privacy Policy or our data
                            practices, please contact us at:
                        </Typography>
                        <Typography variant="body1">
                            <strong>{import.meta.env.VITE_APP_PROJECT_NAME || 'Foxy'}</strong>
                            <br />
                            Email:{' '}
                            <a href={`mailto:${import.meta.env.VITE_APP_CONTACT_EMAIL || 'ofilenkova22@gmail.com'}`}>
                                {import.meta.env.VITE_APP_CONTACT_EMAIL || 'ofilenkova22@gmail.com'}
                            </a>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </>
    );
}
