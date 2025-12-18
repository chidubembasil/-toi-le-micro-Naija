import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Shield, Lock, Eye, UserCheck, Mail } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <Layout>
      <SEO
        title="Privacy Policy"
        description="Learn how À toi le micro Naija collects, uses, and protects your personal information"
        type="website"
      />

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <Shield className="w-12 h-12" />
            <h1 className="text-5xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-xl">
            Last updated: December 2024
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <Eye className="w-8 h-8 text-blue-600" />
              Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              À toi le micro Naija ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <Lock className="w-8 h-8 text-blue-600" />
              Information We Collect
            </h2>
            
            <h3 className="text-2xl font-semibold text-gray-800 mb-3 mt-6">Personal Data</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may collect personally identifiable information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Register for an account</li>
              <li>Subscribe to our newsletter</li>
              <li>Submit podcast episodes or content</li>
              <li>Participate in interactive exercises</li>
              <li>Contact us via email or forms</li>
            </ul>

            <h3 className="text-2xl font-semibold text-gray-800 mb-3">Automatically Collected Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you visit our website, we may automatically collect certain information about your device, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and time spent</li>
              <li>Referring website addresses</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <UserCheck className="w-8 h-8 text-blue-600" />
              How We Use Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use the information we collect in the following ways:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>To provide, operate, and maintain our website and services</li>
              <li>To improve, personalize, and expand our services</li>
              <li>To understand and analyze how you use our website</li>
              <li>To develop new products, services, features, and functionality</li>
              <li>To communicate with you, including for customer service and updates</li>
              <li>To send you newsletters and educational content (with your consent)</li>
              <li>To process your transactions and manage your account</li>
              <li>To prevent fraud and enhance security</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 my-6">
              <p className="text-blue-900 font-medium">
                Types of cookies we use:
              </p>
              <ul className="list-disc pl-6 text-blue-800 mt-2 space-y-1">
                <li><strong>Necessary cookies:</strong> Essential for website functionality</li>
                <li><strong>Analytics cookies:</strong> Help us understand website usage</li>
                <li><strong>Marketing cookies:</strong> Used for personalized advertising</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information. However, please note that no method of transmission over the Internet or electronic storage is 100% secure.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Rights (GDPR)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you are a resident of the European Economic Area (EEA), you have certain data protection rights:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Right to access:</strong> You can request copies of your personal data</li>
              <li><strong>Right to rectification:</strong> You can request correction of inaccurate data</li>
              <li><strong>Right to erasure:</strong> You can request deletion of your data</li>
              <li><strong>Right to restrict processing:</strong> You can request limitation of data processing</li>
              <li><strong>Right to data portability:</strong> You can request transfer of your data</li>
              <li><strong>Right to object:</strong> You can object to our processing of your data</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may use third-party service providers to help us operate our website and services:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Google Analytics for website analytics</li>
              <li>Cloudinary for media storage and delivery</li>
              <li>SendGrid for email communications</li>
              <li>Social media platforms for embedded content</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our services are intended for educational purposes and may be used by students of all ages. We do not knowingly collect personal information from children under 13 without parental consent. If you believe we have collected information from a child under 13, please contact us immediately.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-12 bg-gray-50 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <Mail className="w-8 h-8 text-blue-600" />
              Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Email:</strong> privacy@atoilenaija.com</p>
              <p><strong>Address:</strong> À toi le micro Naija Project Office, Nigeria</p>
              <p><strong>Phone:</strong> +234 XXX XXX XXXX</p>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
