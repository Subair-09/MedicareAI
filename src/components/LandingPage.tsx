import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { FeaturesSection } from './FeaturesSection';
import { AiAssistantAndDoctors } from './AiAssistantAndDoctors';
import { DepartmentsSection } from './DepartmentsSection';
import { StatsAndCtaSection } from './StatsAndCtaSection';
import { AboutSection } from './AboutSection';
import { FaqSection } from './FaqSection';
import { Footer } from './Footer';
import { DoctorProfileModal } from './DoctorProfileModal';
import { DepartmentsModal } from './DepartmentsModal';
import { Doctor, Department } from '../types';
import { DOCTORS } from '../data/hospitalData';

interface LandingPageProps {
  onOpenChatPage: (initialPrompt?: string, doctorName?: string) => void;
  onOpenAdminLogin?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenChatPage, onOpenAdminLogin }) => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [departmentsModalOpen, setDepartmentsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Handle active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'departments', 'doctors', 'about', 'faqs'];
      const scrollPos = window.scrollY + 120;

      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sec);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectDepartment = (dept: Department) => {
    onOpenChatPage(`I would like to book an appointment in the ${dept.name} department.`);
  };

  const handleFeatureClick = (featureId: string) => {
    switch (featureId) {
      case 'feat-1':
        onOpenChatPage("I want to book an appointment with a doctor.");
        break;
      case 'feat-2':
        onOpenChatPage("I would like to reschedule my appointment.");
        break;
      case 'feat-3':
        onOpenChatPage("I need to cancel my appointment.");
        break;
      case 'feat-4':
        onOpenChatPage("Can I check my appointment details?");
        break;
      case 'feat-5':
        onOpenChatPage("What are the hospital visiting hours and consultation fees?");
        break;
      case 'feat-6':
        const deptEl = document.getElementById('departments');
        deptEl?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'feat-7':
        onOpenChatPage("How do I set up SMS appointment reminders?");
        break;
      case 'feat-8':
        onOpenChatPage("Is my medical data and personal information secure?");
        break;
      default:
        onOpenChatPage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#132B52]">
      {/* 1. TOP NAVIGATION */}
      <Navbar
        activeSection={activeSection}
        onOpenChat={() => onOpenChatPage()}
        onOpenAdminLogin={onOpenAdminLogin}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {/* HERO SECTION with Hero Doctor Image and Floating AI Chat Preview */}
        <Hero
          onStartChat={(prompt) => onOpenChatPage(prompt)}
          onExploreDepartments={() => {
            const el = document.getElementById('departments');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* FEATURES SECTION (8 cards in clean grid) */}
        <FeaturesSection onFeatureClick={handleFeatureClick} />

        {/* AI ASSISTANT SECTION & MEET OUR EXPERT DOCTORS */}
        <AiAssistantAndDoctors
          onSelectDoctor={(doctor) => setSelectedDoctor(doctor)}
          onViewAllDoctors={() => {
            setSelectedDoctor(DOCTORS[0]);
          }}
          onStartChatWithDoctor={(docName) => onOpenChatPage(undefined, docName)}
        />

        {/* DEPARTMENTS SECTION */}
        <DepartmentsSection
          onSelectDepartment={handleSelectDepartment}
          onViewAllDepartments={() => setDepartmentsModalOpen(true)}
        />

        {/* STATISTICS SECTION & CALL TO ACTION CARD */}
        <StatsAndCtaSection
          onStartChat={() => onOpenChatPage()}
        />

        {/* Informational About Section */}
        <AboutSection />

        {/* FAQs Section */}
        <FaqSection
          onStartChat={() => onOpenChatPage()}
        />
      </main>

      {/* FOOTER */}
      <Footer
        onOpenPrivacy={() => onOpenChatPage("Can you tell me about MediCare's privacy policy and HIPAA compliance?")}
        onOpenTerms={() => onOpenChatPage("What are the terms of service for MediCare Hospital AI booking?")}
        onOpenAdminLogin={onOpenAdminLogin}
      />

      {/* Modals for doctor profiles and departments */}
      <DoctorProfileModal
        doctor={selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
        onBookWithDoctor={(doctorName) => {
          setSelectedDoctor(null);
          onOpenChatPage(undefined, doctorName);
        }}
      />

      <DepartmentsModal
        isOpen={departmentsModalOpen}
        onClose={() => setDepartmentsModalOpen(false)}
        onSelectDepartment={handleSelectDepartment}
      />
    </div>
  );
};
