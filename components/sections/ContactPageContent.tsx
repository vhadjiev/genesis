"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "@/components/icons";
import { motion, AnimatePresence } from "framer-motion";
import { getLocalizedContent } from "@/utils/data";
import type { LocalizedContent } from "@/types";

interface ProjectTypeOption {
  id: string;
  label: LocalizedContent<string>;
}

interface ServiceTypeOption {
  id: string;
  label: LocalizedContent<string>;
}

interface ContactPageContentData {
  type: "contactPageContent";
  studioInfo: {
    title: LocalizedContent<string>;
    description: LocalizedContent<string>;
    phone: string;
    address: LocalizedContent<string>;
  };
  openingHours: {
    title: LocalizedContent<string>;
    weekdays: {
      label: LocalizedContent<string>;
      hours: LocalizedContent<string>;
    };
    year: {
      label: LocalizedContent<string>;
      hours: LocalizedContent<string>;
    };
    holidays: {
      label: LocalizedContent<string>;
      answer: LocalizedContent<string>;
    };
  };
  formTitle: LocalizedContent<string>;
  projectTypes?: ProjectTypeOption[];
  serviceTypes?: ServiceTypeOption[];
}

interface ContactPageContentProps {
  data: ContactPageContentData;
  locale: string;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ContactPageContent({ data, locale }: ContactPageContentProps) {
  const { t } = useTranslation();
  const { studioInfo, openingHours } = data;

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Form status
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCheckboxChange = (
    value: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setSelectedProjects([]);
    setSelectedServices([]);
  };

  const handleSendAnother = () => {
    setStatus("idle");
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const formData = {
        name,
        email,
        phone,
        message,
        formType: "full",
        projectTypes: selectedProjects.map((type) => {
          const option = data.projectTypes?.find((p) => p.id === type);
          return option ? getLocalizedContent(option.label, locale) : type;
        }),
        services: selectedServices.map((type) => {
          const option = data.serviceTypes?.find((s) => s.id === type);
          return option ? getLocalizedContent(option.label, locale) : type;
        }),
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message");
      }

      setStatus("success");
      resetForm();
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  const inputClasses =
    "w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-sm";

  // Success View Component
  const SuccessView = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center text-center py-12 px-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
        className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mb-6 shadow-lg shadow-green-500/30"
      >
        <Icon icon="mdi:check" className="w-10 h-10 text-white" />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-medium text-gray-900 mb-3"
      >
        {t("contact.form.successTitle")}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-gray-600 max-w-md mb-8 leading-relaxed"
      >
        {t("contact.form.successDescription")}
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={handleSendAnother}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-normal hover:bg-gray-200 transition-colors"
      >
        <Icon icon="mdi:plus" className="w-5 h-5" />
        {t("contact.form.sendAnother")}
      </motion.button>
    </motion.div>
  );

  // Error Message Component
  const ErrorMessage = () => (
    <AnimatePresence mode="wait">
      {status === "error" && (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600"
        >
          <Icon icon="mdi:alert-circle" className="w-5 h-5 shrink-0" />
          <span className="text-sm font-normal">
            {errorMessage || t("contact.form.errorMessage")}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-xl mx-auto space-y-12">
          {/* Contact Info */}
          <div className="space-y-10 text-center">
            {/* Studio Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-medium text-gray-900 mb-4">
                {getLocalizedContent(studioInfo.title, locale)}
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {getLocalizedContent(studioInfo.description, locale)}
              </p>

              <div className="space-y-4 inline-flex flex-col items-start">
                <a
                  href={`tel:${studioInfo.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors group"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon icon="mdi:phone" className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-normal">{studioInfo.phone}</span>
                </a>

                <a
                  href="https://maps.app.goo.gl/V3rvmEvFyFLjkH1d9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors group"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon
                      icon="mdi:map-marker"
                      className="w-5 h-5 text-primary"
                    />
                  </div>
                  <span className="font-normal">
                    {getLocalizedContent(studioInfo.address, locale)}
                  </span>
                </a>
              </div>
            </motion.div>

            {/* Opening Hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-2xl font-medium text-gray-900 mb-6">
                {getLocalizedContent(openingHours.title, locale)}
              </h3>

              <div className="space-y-3 max-w-sm mx-auto">
                <div className="flex justify-between items-center gap-4 py-2">
                  <span className="text-gray-600 font-light">
                    {getLocalizedContent(openingHours.weekdays.label, locale)}
                  </span>
                  <span className="border-b border-gray-200 flex-1" />
                  <span className="text-primary font-medium">
                    {getLocalizedContent(openingHours.weekdays.hours, locale)}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-4 py-2">
                  <span className="text-gray-600 font-light">
                    {getLocalizedContent(openingHours.year.label, locale)}
                  </span>
                  <span className="border-b border-gray-200 flex-1" />
                  <span className="text-primary font-medium">
                    {getLocalizedContent(openingHours.year.hours, locale)}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-4 py-2">
                  <span className="text-gray-600 font-light">
                    {getLocalizedContent(openingHours.holidays.label, locale)}
                  </span>
                  <span className="border-b border-gray-200 flex-1" />
                  <span className="text-primary font-medium">
                    {getLocalizedContent(openingHours.holidays.answer, locale)}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Contact Form */}
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <SuccessView key="success" />
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-medium text-gray-900 mb-2">
                    {getLocalizedContent(data.formTitle, locale)}
                  </h3>
                  <div className="w-12 h-1 bg-primary rounded-full mx-auto" />
                </div>

                <ErrorMessage />

                {/* Name and Phone Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-normal text-gray-700">
                      {t("contact.form.name")}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={status === "submitting"}
                      className={inputClasses}
                      placeholder={t("contact.form.name")}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-normal text-gray-700">
                      {t("contact.form.mobile")}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={status === "submitting"}
                      className={inputClasses}
                      placeholder="+359 ..."
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-normal text-gray-700">
                    {t("contact.form.email")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === "submitting"}
                    className={inputClasses}
                    placeholder="email@example.com"
                  />
                </div>

                {/* Project Types */}
                {data.projectTypes && data.projectTypes.length > 0 && (
                  <div className="space-y-3">
                    <label className="block text-sm font-normal text-gray-700">
                      {t("contact.form.projectType")}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {data.projectTypes.map((type) => {
                        const isSelected = selectedProjects.includes(type.id);
                        return (
                          <motion.button
                            key={type.id}
                            type="button"
                            onClick={() =>
                              handleCheckboxChange(
                                type.id,
                                selectedProjects,
                                setSelectedProjects
                              )
                            }
                            disabled={status === "submitting"}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`
                              inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-normal
                              transition-all duration-200 border
                              ${
                                isSelected
                                  ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                                  : "bg-white text-gray-600 border-gray-200 hover:border-primary/50 hover:bg-primary/5"
                              }
                              disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                          >
                            <span
                              className={`
                              w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
                              ${
                                isSelected
                                  ? "border-white bg-white"
                                  : "border-gray-300 bg-white"
                              }
                            `}
                            >
                              {isSelected && (
                                <Icon
                                  icon="mdi:check"
                                  className="w-3 h-3 text-primary"
                                />
                              )}
                            </span>
                            {getLocalizedContent(type.label, locale)}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Service Types */}
                {data.serviceTypes && data.serviceTypes.length > 0 && (
                  <div className="space-y-3">
                    <label className="block text-sm font-normal text-gray-700">
                      {t("contact.form.services")}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {data.serviceTypes.map((type) => {
                        const isSelected = selectedServices.includes(type.id);
                        return (
                          <motion.button
                            key={type.id}
                            type="button"
                            onClick={() =>
                              handleCheckboxChange(
                                type.id,
                                selectedServices,
                                setSelectedServices
                              )
                            }
                            disabled={status === "submitting"}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`
                              inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-normal
                              transition-all duration-200 border
                              ${
                                isSelected
                                  ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                                  : "bg-white text-gray-600 border-gray-200 hover:border-primary/50 hover:bg-primary/5"
                              }
                              disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                          >
                            <span
                              className={`
                              w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
                              ${
                                isSelected
                                  ? "border-white bg-white"
                                  : "border-gray-300 bg-white"
                              }
                            `}
                            >
                              {isSelected && (
                                <Icon
                                  icon="mdi:check"
                                  className="w-3 h-3 text-primary"
                                />
                              )}
                            </span>
                            {getLocalizedContent(type.label, locale)}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Message */}
                <div className="space-y-2">
                  <label className="block text-sm font-normal text-gray-700">
                    {t("contact.form.description")}
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={status === "submitting"}
                    className={`${inputClasses} resize-none`}
                    placeholder={t("contact.form.description")}
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={status === "submitting"}
                  whileHover={{ scale: status === "submitting" ? 1 : 1.01 }}
                  whileTap={{ scale: status === "submitting" ? 1 : 0.99 }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-primary text-white font-normal hover:bg-primary/90 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                >
                  {status === "submitting" ? (
                    <>
                      <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
                      {t("contact.form.sending")}
                    </>
                  ) : (
                    <>
                      {t("contact.form.submit")}
                      <Icon icon="mdi:send" className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
