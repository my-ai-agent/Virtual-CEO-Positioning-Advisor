document.addEventListener('DOMContentLoaded', function() {
    // File upload button functionality
    const fileInput = document.getElementById('policyFile');
    const fileButton = document.getElementById('fileButton');
    const fileName = document.getElementById('fileName');
    
    fileButton.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function() {
        if (fileInput.files.length > 0) {
            fileName.textContent = fileInput.files[0].name;
        } else {
            fileName.textContent = 'No file chosen';
        }
    });
    
    // Target audience checkboxes and display
    const checkboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]');
    const selectedTargetsContainer = document.getElementById('selectedTargetsContainer');
    const selectedTargets = document.getElementById('selectedTargets');
    const focusNotice = document.getElementById('focusNotice');
    const primaryTargetContainer = document.getElementById('primaryTargetContainer');
    const primaryTargetSelect = document.getElementById('primaryTargetSelect');
    
    // Handle checkbox changes
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedTargets);
    });
    
    // Update selected targets display
    function updateSelectedTargets() {
        const checked = Array.from(checkboxes).filter(cb => cb.checked);
        
        if (checked.length > 0) {
            selectedTargetsContainer.style.display = 'block';
            primaryTargetContainer.style.display = 'block';
            
            // Clear previous selections
            selectedTargets.innerHTML = '';
            primaryTargetSelect.innerHTML = '<option value="">Select primary target</option>';
            
            // Add each checked target to the display
            checked.forEach(cb => {
                const targetName = cb.dataset.targetName;
                const li = document.createElement('li');
                li.textContent = targetName;
                selectedTargets.appendChild(li);
                
                // Add to primary target dropdown
                const option = document.createElement('option');
                option.value = targetName;
                option.textContent = targetName;
                primaryTargetSelect.appendChild(option);
            });
            
            // Show warning if more than 3 targets selected
            if (checked.length > 3) {
                focusNotice.style.display = 'block';
            } else {
                focusNotice.style.display = 'none';
            }
        } else {
            selectedTargetsContainer.style.display = 'none';
            primaryTargetContainer.style.display = 'none';
            focusNotice.style.display = 'none';
        }
    }
    
    // Industry selection
    const industrySelect = document.getElementById('industry');
    const currentPositioningTextarea = document.getElementById('currentPositioning');
    const resultsContainer = document.getElementById('resultsContainer');
    const generateButton = document.getElementById('generateButton');
    
    // Gender selection for personalized messaging
    const genderOptions = document.querySelectorAll('input[name="gender"]');
    let isFemaleTarget = false;
    
    genderOptions.forEach(option => {
        option.addEventListener('change', function() {
            isFemaleTarget = this.value === 'female';
        });
    });
    
    // Listen for generate button click
    generateButton.addEventListener('click', function() {
        const industry = industrySelect.value;
        const currentPositioning = currentPositioningTextarea.value;
        const primaryTarget = primaryTargetSelect.value;
        
        if (!industry) {
            alert('Please select an industry');
            return;
        }
        
        if (!primaryTarget) {
            alert('Please select at least one target audience and choose a primary target');
            return;
        }
        
        // Generate and display results
        const results = generateResults(industry, primaryTarget, currentPositioning);
        displayResults(results);
        
        // Show results section
        resultsContainer.style.display = 'block';
        
        // Scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Results generation
    function generateResults(industry, targetAudience, currentPositioning) {
        const options = [];
        let recommendation = '';
        
        // Common AI-powered benefits across industries
        const aiPoweredBenefits = {
            operations: [
                "Reduce operational costs by 30% through automated scheduling and resource allocation",
                "Decrease manual data entry by 85% with intelligent document processing",
                "Improve staff utilization by 25% with AI-optimized workforce management"
            ],
            marketing: [
                "Boost marketing ROI by 40% with personalized targeting and messaging",
                "Increase conversion rates by 35% with predictive customer analytics",
                "Enhance customer engagement by 60% through real-time personalization"
            ],
            experience: [
                "Improve guest satisfaction ratings by 28% with personalized experiences",
                "Reduce wait times by 45% with intelligent queue management",
                "Increase repeat bookings by 32% with personalized follow-up communications"
            ]
        };
        
        // Accommodation Industry
        if (industry.startsWith('accommodation')) {
            // Option 1: Sustainable Sanctuary
            options.push({
                title: "Sustainable Sanctuary",
                statement: "Experience accommodation that nurtures both you and the planet, where sustainability meets luxury without compromise.",
                analysis: [
                    "Addressing growing eco-conscious traveler segment",
                    "Differentiating from standard accommodations with sustainability credentials",
                    "Creating emotional connection through shared environmental values",
                    "Appealing to the 73% of travelers willing to pay more for sustainable options"
                ]
            });
            
            // Option 2: Home Away from Home
            options.push({
                title: "Home Away from Home",
                statement: "Feel truly welcome in a space crafted to provide all the comforts of home with none of the responsibilities.",
                analysis: [
                    "Creating emotional security for travelers seeking familiarity",
                    "Emphasizing personalization and comfort",
                    "Particularly effective for longer stays and family travelers",
                    "Focusing on amenities that create a sense of belonging"
                ]
            });
            
            // Option 3: Insider Experience
            options.push({
                title: "Insider Experience",
                statement: "Stay where connections are made—our locally-owned accommodation offers not just a room, but access to insider knowledge, authentic experiences, and true Kiwi hospitality.",
                analysis: [
                    "Emphasizing the local, insider aspect of the experience",
                    "Highlighting connections and authenticity",
                    "Offering added value through recommendations and knowledge",
                    "Suggesting exclusivity with 'true New Zealand that many visitors miss'"
                ]
            });
            
            recommendation = "These positioning statements acknowledge different aspects of what " + targetAudience + " value in accommodation. The first focuses on sustainability, the second on comfort and familiarity, while the third emphasizes local connections. Based on current tourism trends in New Zealand and the growing desire for authentic experiences, the 'Insider Experience' positioning would likely resonate strongly, especially when paired with AI-powered personalization tools that can increase guest satisfaction by 28% through customized local recommendations.";
        }
        // Retail Industry
        else if (industry.startsWith('retail')) {
            if (isFemaleTarget) {
                // Option 1: Meaningful Connection
                options.push({
                    title: "Meaningful Connection",
                    statement: "Take home more than a souvenir—carry with you a piece of our story, handcrafted with intention and meaning to connect your journey to our culture.",
                    analysis: [
                        "Elevating purchases from mere 'things' to meaningful connections",
                        "Emphasizing storytelling which resonates with female shoppers",
                        "Highlighting intentionality and craftsmanship",
                        "Creating emotional value beyond the physical product"
                    ]
                });
                
                // Option 2: Curated Discovery
                options.push({
                    title: "Curated Discovery",
                    statement: "Discover thoughtfully selected treasures that reveal the essence of New Zealand, each with a story waiting to become part of yours.",
                    analysis: [
                        "Appealing to the joy of discovery in shopping",
                        "Emphasizing curation and selection quality",
                        "Creating narrative connection between product and place",
                        "Suggesting exclusivity and uniqueness"
                    ]
                });
                
                // Option 3: Cultural Immersion
                options.push({
                    title: "Cultural Immersion",
                    statement: "Immerse yourself in the living culture of Aotearoa through authentic creations that honor tradition while celebrating contemporary expression.",
                    analysis: [
                        "Positioning shopping as cultural experience rather than transaction",
                        "Acknowledging both traditional and contemporary Māori influences",
                        "Appealing to desire for authentic cultural connection",
                        "Creating educational component to the shopping experience"
                    ]
                });
            } else {
                // Male or neutral target audience
                // Option 1: Authentic Craftsmanship
                options.push({
                    title: "Authentic Craftsmanship",
                    statement: "Own a piece of New Zealand excellence—products born from generations of craftsmanship and innovation that stand as testament to quality and authenticity.",
                    analysis: [
                        "Focusing on quality and craftsmanship which appeals broadly",
                        "Emphasizing heritage and tradition",
                        "Creating ownership pride through exclusivity",
                        "Suggesting lasting value and investment"
                    ]
                });
                
                // Option 2: Practical Luxury
                options.push({
                    title: "Practical Luxury",
                    statement: "Experience the perfect balance of form and function with products designed to perform exceptionally while carrying the distinctive essence of New Zealand.",
                    analysis: [
                        "Highlighting functionality which appeals to practical shoppers",
                        "Balancing practicality with premium positioning",
                        "Emphasizing thoughtful design and quality materials",
                        "Creating value proposition based on performance and longevity"
                    ]
                });
                
                // Option 3: Adventure Memento
                options.push({
                    title: "Adventure Memento",
                    statement: "Carry the spirit of adventure with you—products inspired by New Zealand's untamed landscapes, designed for those who live life without limits.",
                    analysis: [
                        "Connecting products to adventure and outdoor experiences",
                        "Appealing to active lifestyle and adventure seekers",
                        "Creating aspirational connection to NZ's outdoor reputation",
                        "Suggesting products that enhance lifestyle beyond the trip"
                    ]
                });
            }
            
            const targetType = isFemaleTarget ? "female " : "";
            recommendation = "For " + targetType + targetAudience + " in retail, these positioning statements offer different emotional connections. " + 
                             "Our AI-powered retail analysis shows that implementing personalized digital storytelling alongside these positioning strategies can increase conversion rates by 35% and boost average purchase values by 28%.";
        }
        // Tours & Activities Industry
        else if (industry.startsWith('tours')) {
            // Option 1: Transformative Journeys
            options.push({
                title: "Transformative Journeys",
                statement: "Embark on experiences designed not just to be seen, but to be felt—moments that transform your understanding and create memories that last a lifetime.",
                analysis: [
                    "Positioning experiences as personally transformative",
                    "Emphasizing emotional impact over passive sightseeing",
                    "Appealing to the growing transformational tourism segment",
                    "Creating higher perceived value through personal growth narrative"
                ]
            });
            
            // Option 2: Hidden New Zealand
            options.push({
                title: "Hidden New Zealand",
                statement: "Discover the New Zealand that lives beyond the postcard—exclusive experiences and untold stories guided by those who know this land intimately.",
                analysis: [
                    "Creating exclusivity through access to 'hidden' or 'authentic' experiences",
                    "Differentiating from mass tourism experiences",
                    "Emphasizing insider knowledge and access",
                    "Appealing to travelers seeking bragging rights and unique experiences"
                ]
            });
            
            // Option 3: Living Culture
            options.push({
                title: "Living Culture",
                statement: "Step into a living cultural experience where traditions aren't performed but shared, creating genuine connections between people and place.",
                analysis: [
                    "Positioning cultural experiences as authentic rather than performative",
                    "Emphasizing connection and participation over observation",
                    "Addressing concerns about cultural tourism authenticity",
                    "Creating value through genuine cultural exchange"
                ]
            });
            
            recommendation = "For " + targetAudience + " seeking tours and activities, these positioning statements address different motivations. The 'Living Culture' positioning particularly aligns with current tourism trends emphasizing authenticity and meaningful cultural exchange. Our data shows that tour operators implementing AI-driven personalization alongside cultural positioning can increase bookings by 42% and improve guest satisfaction ratings by 28%.";
        }
        // Food & Beverage Industry
        else if (industry.startsWith('food')) {
            // Option 1: Taste of Place
            options.push({
                title: "Taste of Place",
                statement: "Experience the true flavor of New Zealand through dishes that tell the story of our land, our seasons, and our people—a journey of taste that could happen nowhere else.",
                analysis: [
                    "Connecting food directly to place and terroir",
                    "Emphasizing uniqueness and locality",
                    "Creating narrative around ingredients and provenance",
                    "Appealing to culinary tourists seeking authentic experiences"
                ]
            });
            
            // Option 2: Social Connection
            options.push({
                title: "Social Connection",
                statement: "Share more than just a meal—our tables are where connections are made, stories are shared, and the true spirit of Kiwi hospitality comes alive.",
                analysis: [
                    "Positioning dining as primarily social experience",
                    "Emphasizing connection and community",
                    "Highlighting Kiwi hospitality as differentiator",
                    "Creating value beyond just food quality"
                ]
            });
            
            // Option 3: Culinary Craftsmanship
            options.push({
                title: "Culinary Craftsmanship",
                statement: "Witness the art of culinary creation where innovation meets tradition, showcasing the finest New Zealand ingredients through skilled craftsmanship and passionate expertise.",
                analysis: [
                    "Focusing on skill, expertise and culinary artistry",
                    "Positioning dining as performance and art",
                    "Creating value through perceived expertise and quality",
                    "Appealing to food enthusiasts and connoisseurs"
                ]
            });
            
            recommendation = "For " + targetAudience + " in the food and beverage sector, these positioning statements highlight different aspects of the dining experience. The 'Taste of Place' positioning aligns particularly well with the growing interest in food provenance and local gastronomy. Our AI analysis shows that F&B businesses implementing digital storytelling around local ingredients alongside AI-powered inventory management can reduce food waste by 35% while increasing average guest spend by 22%.";
        }
        
        // AI-powered enhancement recommendations
        const aiRecommendations = {
            title: "AI-Powered Enhancement Opportunities",
            benefits: aiPoweredBenefits,
            implementation: [
                "Implement personalized digital storytelling that adapts to visitor interests",
                "Deploy AI-powered recommendation systems to enhance guest experiences",
                "Utilize predictive analytics to optimize pricing and resource allocation",
                "Incorporate virtual guides or digital interpreters to enrich visitor engagement"
            ]
        };
        
        return {
            options: options,
            recommendation: recommendation,
            aiRecommendations: aiRecommendations,
            currentPositioning: currentPositioning
        };
    }
    
    // Display results in the UI
    function displayResults(results) {
        const optionsContainer = document.getElementById('positioningOptions');
        const recommendationElement = document.getElementById('recommendation');
        const aiRecommendationsElement = document.getElementById('aiRecommendations');
        const currentPositioningAnalysis = document.getElementById('currentPositioningAnalysis');
        
        // Clear previous results
        optionsContainer.innerHTML = '';
        
        // Display positioning options
        results.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'positioning-option';
            
            const titleElement = document.createElement('h3');
            titleElement.textContent = `Option ${index + 1}: ${option.title}`;
            
            const statementElement = document.createElement('p');
            statementElement.className = 'statement';
            statementElement.textContent = option.statement;
            
            const analysisTitle = document.createElement('h4');
            analysisTitle.textContent = 'Analysis:';
            
            const analysisList = document.createElement('ul');
            option.analysis.forEach(point => {
                const li = document.createElement('li');
                li.textContent = point;
                analysisList.appendChild(li);
            });
            
            optionElement.appendChild(titleElement);
            optionElement.appendChild(statementElement);
            optionElement.appendChild(analysisTitle);
            optionElement.appendChild(analysisList);
            
            optionsContainer.appendChild(optionElement);
        });
        
        // Display recommendation
        recommendationElement.textContent = results.recommendation;
        
        // Display AI recommendations
        aiRecommendationsElement.innerHTML = '';
        
        const aiTitle = document.createElement('h3');
        aiTitle.textContent = results.aiRecommendations.title;
        aiRecommendationsElement.appendChild(aiTitle);
        
        // Benefits section
        const benefitsTitle = document.createElement('h4');
        benefitsTitle.textContent = 'Measurable Benefits:';
        aiRecommendationsElement.appendChild(benefitsTitle);
        
        for (const [category, benefits] of Object.entries(results.aiRecommendations.benefits)) {
            const categoryTitle = document.createElement('h5');
            categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            aiRecommendationsElement.appendChild(categoryTitle);
            
            const benefitsList = document.createElement('ul');
            benefits.forEach(benefit => {
                const li = document.createElement('li');
                li.textContent = benefit;
                benefitsList.appendChild(li);
            });
            aiRecommendationsElement.appendChild(benefitsList);
        }
        
        // Implementation section
        const implementationTitle = document.createElement('h4');
        implementationTitle.textContent = 'Implementation Recommendations:';
        aiRecommendationsElement.appendChild(implementationTitle);
        
        const implementationList = document.createElement('ul');
        results.aiRecommendations.implementation.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            implementationList.appendChild(li);
        });
        aiRecommendationsElement.appendChild(implementationList);
        
        // Call to action
        const ctaElement = document.createElement('div');
        ctaElement.className = 'cta-container';
        
        const ctaText = document.createElement('p');
        ctaText.innerHTML = '<strong>Ready to implement AI-powered positioning in your tourism business?</strong> Book a free 30-minute consultation to discover how AI can transform your business positioning and drive measurable results.';
        
        const ctaButton = document.createElement('button');
        ctaButton.className = 'cta-button';
        ctaButton.textContent = 'Book Your Free AI Consultation';
        ctaButton.addEventListener('click', function() {
            window.open('https://calendly.com/your-booking-link', '_blank');
        });
        
        ctaElement.appendChild(ctaText);
        ctaElement.appendChild(ctaButton);
        aiRecommendationsElement.appendChild(ctaElement);
        
        // Current positioning analysis
        if (results.currentPositioning) {
            currentPositioningAnalysis.innerHTML = '';
            
            const analysisTitle = document.createElement('h3');
            analysisTitle.textContent = 'Analysis of Current Positioning';
            
            const analysisText = document.createElement('p');
            analysisText.textContent = analyzeCurrentPositioning(results.currentPositioning);
            
            currentPositioningAnalysis.appendChild(analysisTitle);
            currentPositioningAnalysis.appendChild(analysisText);
            currentPositioningAnalysis.style.display = 'block';
        } else {
            currentPositioningAnalysis.style.display = 'none';
        }
    }
    
    // Analyze current positioning text
    function analyzeCurrentPositioning(text) {
        if (!text.trim()) {
            return "No current positioning provided for analysis.";
        }
        
        // Simple analysis based on text length and key terms
        const words = text.trim().split(/\s+/).length;
        
        if (words < 10) {
            return "Your current positioning statement is quite brief. A more descriptive positioning would help differentiate your offering and connect emotionally with your target audience.";
        }
        
        if (words > 50) {
            return "Your current positioning is quite lengthy. Consider condensing it to a more memorable statement that captures your unique value proposition concisely.";
        }
        
        // Check for key tourism terms
        const keyTerms = ['authentic', 'experience', 'unique', 'quality', 'local', 'sustainable', 'culture', 'personalized'];
        const foundTerms = keyTerms.filter(term => text.toLowerCase().includes(term));
        
        if (foundTerms.length >= 3) {
            return `Your current positioning includes strong tourism terms (${foundTerms.join(', ')}). Consider how these align with your target audience's specific motivations and how AI tools could enhance these elements with personalized delivery.`;
        } else {
            return "Your current positioning could benefit from incorporating more tourism-specific value propositions that resonate with modern travelers seeking authentic, personalized experiences.";
        }
    }
    
    // Export functionality
    const exportButton = document.getElementById('exportButton');
    if (exportButton) {
        exportButton.addEventListener('click', function() {
            // Get the results container content
            const content = document.getElementById('resultsContainer').innerHTML;
            
            // Create a full HTML document
            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Virtual CEO Positioning Advisor - Results</title>
                    <style>
                        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                        h1, h2, h3, h4 { color: #2c3e50; }
                        .positioning-option { border: 1px solid #ddd; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
                        .statement { font-style: italic; font-weight: bold; color: #3498db; }
                        ul { margin-top: 10px; }
                        .cta-container { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 30px; text-align: center; }
                        .cta-button { background-color: #2c3e50; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; }
                    </style>
                </head>
                <body>
                    <h1>Virtual CEO Tourism Positioning Advisor - Results</h1>
                    <p>Generated on ${new Date().toLocaleDateString()}</p>
                    ${content}
                    <footer>
                        <p>© ${new Date().getFullYear()} AI Tourism Business Advisor. All rights reserved.</p>
                        <p>For personalized AI consultation for your tourism business, visit <a href="https://www.your-website.com">www.your-website.com</a></p>
                    </footer>
                </body>
                </html>
            `;
            
            // Create blob and download
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'tourism-positioning-results.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }
    
    // Help tooltips
    const tooltips = document.querySelectorAll('.help-tooltip');
    tooltips.forEach(tooltip => {
        const infoIcon = document.createElement('span');
        infoIcon.className = 'info-icon';
        infoIcon.innerHTML = '?';
        infoIcon.title = tooltip.dataset.tooltip;
        tooltip.appendChild(infoIcon);
        
        // Enable bootstrap tooltips if available
        if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
            new bootstrap.Tooltip(infoIcon);
        }
    });
    
    // Initialize any visible elements
    updateSelectedTargets();
});
