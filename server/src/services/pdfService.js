const PDFDocument = require("pdfkit");

/**
 * Generate a professional itinerary PDF document and stream it to the client
 * @param {Object} trip - Formatted trip object with itinerary, preferences, etc.
 * @param {Object} res - Express HTTP response object
 */
function generateItineraryPdf(trip, res) {
  const doc = new PDFDocument({
    margin: 40,
    size: "A4",
    info: {
      Title: trip.title || "Travel Itinerary",
      Author: "Itinera AI Travel Planner",
      Subject: "Custom Travel Itinerary",
    },
  });

  // Stream document to response
  doc.pipe(res);

  const itinerary = trip.itinerary || trip;
  const days = itinerary.days || [];
  const budget = itinerary.budget || {};

  // Colors
  const primaryColor = "#064e3b"; // Emerald 900
  const secondaryColor = "#047857"; // Emerald 700
  const darkTextColor = "#0f172a"; // Slate 900
  const mutedTextColor = "#64748b"; // Slate 500

  // 1. Header Banner
  doc.rect(40, 40, 515, 65).fill(primaryColor);
  doc.fillColor("#ffffff")
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("ITINERA • AI-CURATED TRAVEL PLANNER", 55, 52);

  doc.fontSize(16)
    .font("Helvetica-Bold")
    .text(trip.title || "Personalized Travel Itinerary", 55, 68, { width: 480, ellipsis: true });

  doc.fontSize(9)
    .font("Helvetica")
    .text(`Destination: ${trip.destination || "Custom"}  •  Duration: ${days.length} Days  •  Est. Total: ₹${(trip.totalBudget || 0).toLocaleString()} INR`, 55, 88);

  doc.moveDown(3);

  // 2. Summary Section
  if (itinerary.summary) {
    doc.fillColor(darkTextColor)
      .fontSize(11)
      .font("Helvetica-Bold")
      .text("TRIP SUMMARY & OVERVIEW", 40, 120);

    doc.fillColor(mutedTextColor)
      .fontSize(9)
      .font("Helvetica")
      .text(itinerary.summary, 40, 135, { width: 515, lineGap: 3 });

    doc.moveDown(1.5);
  }

  // 3. Budget Overview Box
  let currentY = 175;
  doc.rect(40, currentY, 515, 45).fillAndStroke("#f8fafc", "#e2e8f0");
  doc.fillColor(darkTextColor)
    .fontSize(9)
    .font("Helvetica-Bold")
    .text("ESTIMATED BUDGET BREAKDOWN (INR)", 50, currentY + 8);

  const total = (budget.hotel || 0) + (budget.food || 0) + (budget.transport || 0) + (budget.activities || 0) + (budget.misc || 0);
  doc.fontSize(8)
    .font("Helvetica")
    .fillColor(mutedTextColor)
    .text(`• Stay/Hotel: ₹${(budget.hotel || 0).toLocaleString()}   • Food/Dining: ₹${(budget.food || 0).toLocaleString()}   • Transport: ₹${(budget.transport || 0).toLocaleString()}   • Activities: ₹${(budget.activities || 0).toLocaleString()}   • Buffer: ₹${(budget.misc || 0).toLocaleString()}   • Total: ₹${total.toLocaleString()}`, 50, currentY + 24);

  currentY += 60;

  // 4. Day-by-Day Detailed Schedule
  doc.fillColor(primaryColor)
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("DAY-BY-DAY ITINERARY", 40, currentY);

  currentY += 18;

  days.forEach((day) => {
    // Check if space remaining on page, else create new page
    if (currentY > 700) {
      doc.addPage();
      currentY = 40;
    }

    // Day Header Strip
    doc.rect(40, currentY, 515, 20).fill("#ecfdf5");
    doc.fillColor(secondaryColor)
      .fontSize(10)
      .font("Helvetica-Bold")
      .text(`Day ${day.day}: ${day.title} ${day.theme ? `(${day.theme})` : ""}`, 48, currentY + 5);

    currentY += 26;

    // Activities for the day
    (day.activities || []).forEach((act) => {
      if (currentY > 740) {
        doc.addPage();
        currentY = 40;
      }

      doc.fillColor(darkTextColor)
        .fontSize(9)
        .font("Helvetica-Bold")
        .text(`[${act.timeSlot || "Scheduled"} • ${act.time || "09:00 AM"}]  ${act.title || act.activity}`, 48, currentY);

      currentY += 12;

      if (act.description) {
        doc.fillColor(mutedTextColor)
          .fontSize(8)
          .font("Helvetica")
          .text(act.description, 48, currentY, { width: 495, lineGap: 1.5 });
        currentY += doc.heightOfString(act.description, { width: 495, lineGap: 1.5 }) + 3;
      }

      // Metadata line
      const meta = [];
      if (act.locationName) meta.push(`📍 ${act.locationName}`);
      if (act.duration) meta.push(`⏱️ ${act.duration}`);
      if (act.estimatedCost) meta.push(`💰 ₹${act.estimatedCost}`);
      if (act.travelNotes) meta.push(`💡 Tip: ${act.travelNotes}`);

      if (meta.length > 0) {
        doc.fillColor("#059669")
          .fontSize(7.5)
          .font("Helvetica-Oblique")
          .text(meta.join("  |  "), 48, currentY, { width: 495 });
        currentY += 12;
      }

      currentY += 4;
    });

    // Dining note
    if (day.restaurantSuggestion && day.restaurantSuggestion.name) {
      doc.fillColor("#b45309")
        .fontSize(8)
        .font("Helvetica-Bold")
        .text(`🍽️ Recommended Dining: ${day.restaurantSuggestion.name} (${day.restaurantSuggestion.cuisine || "Local Cuisine"} - ${day.restaurantSuggestion.priceRange || "₹₹"}) • Must Try: ${day.restaurantSuggestion.recommendedDish || "Chef Special"}`, 48, currentY, { width: 495 });
      currentY += 14;
    }

    currentY += 8;
  });

  // 5. Travel Tips & Warnings (New page if needed)
  if (currentY > 650) {
    doc.addPage();
    currentY = 40;
  }

  if (itinerary.travelTips && itinerary.travelTips.length > 0) {
    doc.fillColor(primaryColor)
      .fontSize(11)
      .font("Helvetica-Bold")
      .text("PRACTICAL TRAVEL TIPS", 40, currentY);

    currentY += 14;

    itinerary.travelTips.forEach((tip) => {
      doc.fillColor(darkTextColor)
        .fontSize(8)
        .font("Helvetica")
        .text(`• ${tip}`, 48, currentY, { width: 495 });
      currentY += 12;
    });

    currentY += 10;
  }

  // Footer on each page
  const pageRange = doc.bufferedPageRange();
  for (let i = 0; i < pageRange.count; i++) {
    doc.switchToPage(i);
    doc.fillColor("#94a3b8")
      .fontSize(7)
      .font("Helvetica")
      .text(
        `Generated by Itinera AI Travel Planner • Page ${i + 1} of ${pageRange.count} • www.itinera.in`,
        40,
        800,
        { align: "center", width: 515 }
      );
  }

  doc.end();
}

module.exports = {
  generateItineraryPdf,
};
