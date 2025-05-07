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
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', updateSelectedTargets);
    });
    
    // Handle "Other" checkbox
    document.getElementById('target_other').addEventListener('change', function() {
        const otherContainer = document.getElementById('otherTargetContainer');
        if (this.checked) {
            otherContainer.style.display = 'block';
            document.getElementById('otherTarget').setAttribute('required', 'required');
        } else {
            otherContainer.style.display = 'none';
            document.getElementById('otherTarget').removeAttribute('required');
        }
    });
    
    // Update selected targets display
    function updateSelectedTargets() {
        // Clear current display
        selectedTargets.innerHTML = '';
        
        // Get all checked boxes
        const checkedBoxes = Array.from(checkboxes).filter(box => box.checked);
        
        // If none are checked, hide the container
        if (checkedBoxes.length === 0) {
            selectedTargetsContainer.style.display = 'none';
            focusNotice.style.display = 'none';
            primaryTargetContainer.style.display = 'none';
            return;
        }
        
        // Show the container
        selectedTargetsContainer.style.display = 'block';
        
        // Add pills for each selected target
        checkedBoxes.forEach(box => {
            let value = box.value;
            
            // Handle "Other" case
            if (value === 'Other' && document.getElementById('otherTarget').value) {
                value = document.getElementById('otherTarget').value;
            }
            
            const pill = document.createElement('span');
            pill.className = 'target-pill';
            pill.innerHTML = value + ' <button type="button" data-id="' + box.id + '" aria-label="Remove ' + value + '">×</button>';
            
            // Add remove button functionality
            pill.querySelector('button').addEventListener('click', function() {
                document.getElementById(this.dataset.id).checked = false;
                updateSelectedTargets();
            });
            
            selectedTargets.appendChild(pill);
        });
        
        // Show focus notice and primary target selector if more than 1 is selected
        if (checkedBoxes.length > 1) {
            focusNotice.style.display = 'block';
            primaryTargetContainer.style.display = 'block';
            
            // Update primary target dropdown options
            updatePrimaryTargetOptions(checkedBoxes);
        } else {
            focusNotice.style.display = 'none';
            primaryTargetContainer.style.display = 'none';
        }
    }
    
    // Update primary target dropdown options
    function updatePrimaryTargetOptions(checkedBoxes) {
        // Clear current options (except the placeholder)
        while (primaryTargetSelect.options.length > 1) {
            primaryTargetSelect.remove(1);
        }
        
        // Add an option for each checked box
        checkedBoxes.forEach(box => {
            let value = box.value;
            
            // Handle "Other" case
            if (value === 'Other' && document.getElementById('otherTarget').value) {
                value = document.getElementById('otherTarget').value;
            }
            
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            primaryTargetSelect.appendChild(option);
        });
    }
    
    // Update other target label when input changes
    document.getElementById('otherTarget').addEventListener('input', function() {
        if (document.getElementById('target_other').checked) {
            updateSelectedTargets();
        }
    });
    
    // Image upload functionality
    const dropArea = document.getElementById('dropArea');
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    
    // Handle click on drop area
    dropArea.addEventListener('click', function() {
        imageUpload.click();
    });
    
    // Handle file selection
    imageUpload.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            handleImage(this.files[0]);
        }
    });
    
    // Handle drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, function(e) {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, function() {
            dropArea.classList.add('highlight');
        }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, function() {
            dropArea.classList.remove('highlight');
        }, false);
    });
    
    dropArea.addEventListener('drop', function(e) {
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImage(e.dataTransfer.files[0]);
        }
    }, false);
    
    // Handle paste (for screenshots)
    document.addEventListener('paste', function(e) {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                handleImage(blob);
                break;
            }
        }
    });
    
    function handleImage(file) {
        if (!file.type.match('image.*')) {
            alert('Please select an image file');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            dropArea.querySelector('p').style.display = 'none';
            dropArea.querySelector('.instructions').style.display = 'none';
        };
        
        reader.readAsDataURL(file);
    }
    
    // Form submission
    document.getElementById('assessmentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const industry = document.getElementById('industrySelect').value;
        const currentPositioning = document.getElementById('currentPositioning').value;
        const imageUploaded = imagePreview.style.display !== 'none';
        
        // Get target audiences
        const checkedBoxes = Array.from(checkboxes).filter(box => box.checked);
        let primaryTarget;
        
        if (checkedBoxes.length === 0) {
            alert('Please select at least one target audience');
            return;
        } else if (checkedBoxes.length === 1) {
            primaryTarget = checkedBoxes[0].value;
            if (primaryTarget === 'Other') {
                primaryTarget = document.getElementById('otherTarget').value;
            }
        } else {
            primaryTarget = primaryTargetSelect.value;
            if (!primaryTarget) {
                alert('Please select your primary target audience');
                return;
            }
        }
        
        // Basic validation
        if (industry === '') {
            alert('Please select your industry');
            return;
        }
        
        if (currentPositioning === '') {
            alert('Please enter your current positioning statement');
            return;
        }
        
        if (!imageUploaded) {
            alert('Please upload a screenshot of your website landing page');
            return;
        }
        
        // Show results (in a real implementation, this would first send data to a server)
        generateResults(industry, primaryTarget, currentPositioning);
    });
    
    // Generate results (simulating AI processing)
    function generateResults(industry, targetAudience, currentPositioning) {
        let recommendation;
        const options = [];
        
        // Target audience specific content
        const isFemaleTarget = targetAudience.includes('Female');
        
        // Generate different positioning statements based on industry and target audience
        if (industry.startsWith('tourism_cultural')) {
            if (isFemaleTarget) {
                // Option 1: Emotional Connection
                options.push({
                    title: "Emotional Connection",
                    statement: "Walk alongside our Māori Kaitiaki (guardians) as they share ancient wisdom that reconnects you to the rhythms of land and spirit—a journey just for you.",
                    analysis: [
                        "Creating a personal invitation with 'walk alongside' language",
                        "Highlighting authentic cultural connection with 'Māori Kaitiaki'",
                        "Emphasizing personal transformation with 'reconnects you'",
                        "Addressing the desire for meaningful 'me time' with 'a journey just for you'"
                    ]
                });
                
                // Option 2: Authentic Experience
                options.push({
                    title: "Authentic Experience",
                    statement: "Experience the living traditions of Māori culture through the eyes of our Kaitiaki—where every story shared creates meaningful connections that stay with you long after you leave.",
                    analysis: [
                        "Using 'experience' language that resonates with female travelers",
                        "Emphasizing authenticity with 'living traditions'",
                        "Focusing on storytelling as a vehicle for connection",
                        "Highlighting lasting impact with 'stay with you long after'"
                    ]
                });
                
                // Option 3: Transformative Journey
                options.push({
                    title: "Transformative Journey",
                    statement: "Discover the wisdom of Te Ao Māori (the Māori worldview) in a journey that nurtures your spirit—where ancient traditions create space for reflection, connection, and personal growth.",
                    analysis: [
                        "Framing the experience as a voyage of discovery",
                        "Using nurturing language with 'nurtures your spirit'",
                        "Emphasizing self-development opportunities",
                        "Balancing cultural learning with personal benefit"
                    ]
                });
                
                recommendation = "These positioning statements transform your standard experience description into emotional journeys that speak directly to women seeking meaningful travel experiences. Each option emphasizes different aspects—personal connection, authentic experience, and transformation. Consider testing these positioning statements on your website and social media to measure engagement from female visitors.";
            
            } else {
                // Option 1: Educational Value
                options.push({
                    title: "Educational Value",
                    statement: "Step into living history with our Māori Kaitiaki (guardians) who reveal ancient wisdom and traditions that will transform your understanding of New Zealand's cultural heritage.",
                    analysis: [
                        "Using active language with 'step into' that invites participation",
                        "Emphasizing authenticity with 'living history' and 'Māori Kaitiaki'",
                        "Highlighting educational value with 'reveal ancient wisdom'",
                        "Promising transformation of understanding rather than just an activity"
                    ]
                });
                
                // Option 2: Authentic Immersion
                options.push({
                    title: "Authentic Immersion",
                    statement: "Immerse yourself in the rich traditions of Māori culture—where our Kaitiaki reveal the sacred connections between people, land, and ancestry that have shaped New Zealand for centuries.",
                    analysis: [
                        "Emphasizing immersive experience with 'immerse yourself'",
                        "Highlighting cultural depth with 'rich traditions'",
                        "Focusing on connections between culture and environment",
                        "Adding historical context with 'shaped New Zealand for centuries'"
                    ]
                });
                
                // Option 3: Exclusive Access
                options.push({
                    title: "Exclusive Access",
                    statement: "Gain privileged insights into Māori culture through experiences not available to the independent traveler—where traditional knowledge keepers share the stories, skills, and traditions that define New Zealand's cultural identity.",
                    analysis: [
                        "Emphasizing exclusivity with 'privileged insights' and 'not available'",
                        "Highlighting authenticity through 'traditional knowledge keepers'",
                        "Offering comprehensive cultural content with 'stories, skills, and traditions'",
                        "Connecting the experience to national identity"
                    ]
                });
                
                recommendation = "These positioning statements focus on different aspects of cultural tourism that resonate with " + targetAudience + ". The first emphasizes educational value, the second authentic immersion, and the third exclusive access. Consider using the language that best aligns with what your specific audience segment values most in cultural experiences.";
            }
        }
        else if (industry.startsWith('tourism_adventure')) {
            if (isFemaleTarget) {
                // Option 1: Personal Growth
                options.push({
                    title: "Personal Growth",
                    statement: "Discover your inner strength through our guided adventures—where every challenge is an opportunity to connect with yourself and the untamed beauty of nature.",
                    analysis: [
                        "Focusing on self-discovery rather than just thrill-seeking",
                        "Using supportive language with 'guided adventures'",
                        "Reframing challenges as opportunities for growth",
                        "Creating emotional connection to both self and nature"
                    ]
                });
                
                // Option 2: Balanced Adventure
                options.push({
                    title: "Balanced Adventure",
                    statement: "Experience the perfect balance of excitement and support—where our expertly guided adventures allow you to embrace thrilling challenges while feeling completely secure in your journey.",
                    analysis: [
                        "Highlighting balance between excitement and security",
                        "Emphasizing expert guidance and support",
                        "Addressing safety concerns without diminishing the adventure",
                        "Using 'embrace' language that suggests active participation on your terms"
                    ]
                });
                
                // Option 3: Meaningful Accomplishment
                options.push({
                    title: "Meaningful Accomplishment",
                    statement: "Achieve something extraordinary in New Zealand's breathtaking landscapes—where our supportive guides help you conquer challenges that reveal your capabilities and create stories you'll share for years to come.",
                    analysis: [
                        "Emphasizing achievement and accomplishment",
                        "Highlighting the spectacular setting",
                        "Including supportive guidance as a key element",
                        "Focusing on meaningful stories and memories created"
                    ]
                });
                
                recommendation = "These positioning statements transform adventure activities from purely adrenaline-focused to meaningful experiences that offer personal growth, balanced excitement, and meaningful accomplishment. Each option addresses different motivations that female travelers often have when seeking adventure experiences. Consider testing these to see which resonates most strongly with your target audience.";
                
            } else {
                // Option 1: Ultimate Challenge
                options.push({
                    title: "Ultimate Challenge",
                    statement: "Challenge yourself in New Zealand's most spectacular landscapes—where unforgettable adventures await those ready to push their limits and create lasting memories.",
                    analysis: [
                        "Direct challenge language that appeals to adventure-seekers",
                        "Highlighting the spectacular setting as part of the experience",
                        "Emphasizing the opportunity to 'push limits' for personal achievement",
                        "Focusing on memory-making rather than just activities"
                    ]
                });
                
                // Option 2: Expert Adventure
                options.push({
                    title: "Expert Adventure",
                    statement: "Experience world-class adventures designed by experts who know New Zealand's wilderness intimately—where cutting-edge equipment and professional guides ensure the ultimate combination of thrill and safety.",
                    analysis: [
                        "Emphasizing expertise and professionalism",
                        "Highlighting quality with 'world-class' and 'cutting-edge'",
                        "Addressing the balance of excitement and safety",
                        "Suggesting insider knowledge with 'know New Zealand's wilderness intimately'"
                    ]
                });
                
                // Option 3: Epic Storytelling
                options.push({
                    title: "Epic Storytelling",
                    statement: "Embark on adventures worthy of epic stories—where New Zealand's most dramatic landscapes become the backdrop for your journey of discovery, challenge, and achievement.",
                    analysis: [
                        "Framing the adventure as a heroic journey",
                        "Emphasizing the cinematic quality of the landscapes",
                        "Highlighting the narrative aspect with 'epic stories'",
                        "Including elements of discovery and achievement"
                    ]
                });
                
                recommendation = "These positioning statements emphasize different aspects of adventure that appeal to " + targetAudience + ". The first focuses on personal challenge, the second on expert-led quality, and the third on the epic, story-worthy nature of the experience. Each approach can be effective depending on your specific offering and the exact preferences of your target audience.";
            }
        }
        else if (industry.startsWith('hospitality_accommodation')) {
            if (isFemaleTarget) {
                // Option 1: Wellbeing Sanctuary
                options.push({
                    title: "Wellbeing Sanctuary",
                    statement: "A sanctuary designed with your wellbeing in mind—where thoughtful details create space for reflection, connection, and the rest you truly deserve.",
                    analysis: [
                        "Using 'sanctuary' language that resonates with women seeking respite",
                        "Emphasizing wellbeing and self-care as priorities",
                        "Highlighting attention to detail which women often value",
                        "Addressing the guilt-free aspect of taking time for oneself"
                    ]
                });
                
                // Option 2: Home Away from Home
                options.push({
                    title: "Home Away from Home",
                    statement: "Your New Zealand home where every comfort is considered—blending local hospitality with personalized touches that make you feel both cared for and free to be yourself.",
                    analysis: [
                        "Creating a sense of belonging with 'your New Zealand home'",
                        "Emphasizing comfort and care",
                        "Highlighting personalization which female travelers often value",
                        "Balancing nurturing with freedom and autonomy"
                    ]
                });
                
                // Option 3: Immersive Retreat
                options.push({
                    title: "Immersive Retreat",
                    statement: "Immerse yourself in authentic New Zealand hospitality—where our intimate setting connects you to local culture, natural beauty, and the restorative power of true relaxation.",
                    analysis: [
                        "Focusing on immersive experience rather than just accommodation",
                        "Emphasizing authentic connection to place",
                        "Highlighting the restorative aspect of the stay",
                        "Creating a holistic experience that blends culture, nature, and relaxation"
                    ]
                });
                
                recommendation = "These positioning statements elevate your accommodation from simply a place to stay to a meaningful part of the journey. Each option emphasizes different aspects—wellbeing, comfort, and immersive experience—that resonate with female travelers. Consider which positioning best reflects your unique offering and test the messaging with your target audience.";
                
            } else {
                // Option 1: Strategic Base
                options.push({
                    title: "Strategic Base",
                    statement: "Your ideal base for exploring New Zealand's wonders—where comfort meets convenience, and every stay is enhanced by our signature hospitality and local knowledge.",
                    analysis: [
                        "Positioning as a 'base' for exploration appeals to active travelers",
                        "Balancing practical considerations (comfort, convenience) with experience",
                        "Highlighting service quality with 'signature hospitality'",
                        "Adding value through 'local knowledge' that enhances the broader trip"
                    ]
                });
                
                // Option 2: Authentic Luxury
                options.push({
                    title: "Authentic Luxury",
                    statement: "Experience the perfect balance of authentic New Zealand character and premium comfort—where attentive service and thoughtful amenities create a distinctive stay that enhances your entire journey.",
                    analysis: [
                        "Emphasizing the balance of authenticity and luxury",
                        "Highlighting service quality and attention to detail",
                        "Focusing on distinctiveness rather than generic luxury",
                        "Positioning the accommodation as enhancing the broader experience"
                    ]
                });
                
                // Option 3: Insider Experience
                options.push({
                    title: "Insider Experience",
                    statement: "Stay where connections are made—our locally-owned accommodation offers not just a room, but access to insider knowledge, authentic recommendations, and the true New Zealand that many visitors miss.",
                    analysis: [
                        "Emphasizing the local, insider aspect of the experience",
                        "Highlighting connections and authenticity",
                        "Offering added value through recommendations and knowledge",
                        "Suggesting exclusivity with 'true New Zealand that many visitors miss'"
                    ]
                });
                
                recommendation = "These positioning statements acknowledge different aspects of what " + targetAudience + " value in accommodation. The first focuses on strategic convenience, the second on authentic luxury, and the third on insider access. Consider which positioning best aligns with both your offering and recommendation = "These positioning statements acknowledge different aspects of what " + targetAudience + " value in accommodation. The first focuses on strategic convenience, the second on authentic luxury, and the third on insider access. Consider which positioning best aligns with both your offering and the specific preferences of your target audience segment.";
            }
        }
        else if (industry.startsWith('retail')) {
            if (isFemaleTarget) {
                // Option 1: Meaningful Connection
                options.push({
                    title: "Meaningful Connection",
                    statement: "Take home more than a souvenir—carry with you a piece of our story, handcrafted with intention and meaning to connect your journey with our heritage.",
                    analysis: [
                        "Elevating purchases from mere 'things' to meaningful connections",
                        "Emphasizing storytelling which resonates with female shoppers",
                        "Highlighting intentionality and craftsmanship",
                        "Creating continuity between the travel experience and life at home"
                    ]
                });
                
                // Option 2: Thoughtful Curation
                options.push({
                    title: "Thoughtful Curation",
                    statement: "Discover treasures thoughtfully curated to reflect New Zealand's unique spirit—each piece selected to bring beauty, meaning, and a touch of Kiwi magic into your everyday life.",
                    analysis: [
                        "Emphasizing the curatorial expertise behind the selection",
                        "Focusing on how items enhance daily life beyond the trip",
                        "Highlighting the emotional benefits with 'beauty, meaning, and magic'",
                        "Creating a sense of discovery rather than just shopping"
                    ]
                });
                
                // Option 3: Ethical Purchasing
                options.push({
                    title: "Ethical Purchasing",
                    statement: "Choose gifts that honor both giver and receiver—our ethically sourced, sustainably crafted treasures support local artisans while bringing the essence of New Zealand into your home and heart.",
                    analysis: [
                        "Highlighting ethical and sustainable aspects of purchases",
                        "Emphasizing the relationship between giver and receiver",
                        "Focusing on supporting community and local artisans",
                        "Creating emotional connection with 'home and heart' language"
                    ]
                });
                
                recommendation = "These positioning statements transform shopping from a transactional experience to different types of meaningful exchanges. Each option emphasizes different aspects—story and heritage connection, thoughtful curation, and ethical purchasing—that resonate strongly with female consumers seeking purpose in their purchases.";
                
            } else {
                // Option 1: Authentic Craftsmanship
                options.push({
                    title: "Authentic Craftsmanship",
                    statement: "Authentic New Zealand craftsmanship to commemorate your journey—each piece tells a story of our land, culture, and the skilled artisans who preserve our traditions.",
                    analysis: [
                        "Emphasizing authenticity and craftsmanship which appeals to quality-conscious buyers",
                        "Positioning purchases as commemorative rather than merely decorative",
                        "Highlighting the connection to place with 'our land, culture'",
                        "Adding value through the story of skilled artisans and traditions"
                    ]
                });
                
                // Option 2: Distinctive Quality
                options.push({
                    title: "Distinctive Quality",
                    statement: "Select from New Zealand's finest crafted treasures—unique pieces that stand apart from mass-produced souvenirs and reflect the exceptional quality and distinctive character of our land and people.",
                    analysis: [
                        "Emphasizing quality and uniqueness",
                        "Creating contrast with 'mass-produced souvenirs'",
                        "Highlighting distinctiveness and exceptionalism",
                        "Connecting products to national character and identity"
                    ]
                });
                
                // Option 3: Lasting Value
                options.push({
                    title: "Lasting Value",
                    statement: "Invest in enduring pieces that maintain their value and meaning—our carefully selected New Zealand treasures are designed to be used, displayed, and appreciated for years to come.",
                    analysis: [
                        "Positioning purchases as investments rather than expenditures",
                        "Emphasizing longevity and enduring quality",
                        "Highlighting practical usage and display value",
                        "Suggesting careful selection and curation"
                    ]
                });
                
                recommendation = "These positioning statements appeal to " + targetAudience + " by focusing on different aspects of quality retail experiences. The first emphasizes authentic craftsmanship, the second distinctive quality, and the third lasting value. Each approach transforms purchasing from a tourist activity to acquiring something of genuine significance.";
            }
        }
        else {
            // Generic response for other industries
            if (isFemaleTarget) {
                // Option 1: Emotional Connection
                options.push({
                    title: "Emotional Connection",
                    statement: "Experience our offerings designed with your values in mind—where authentic connection meets purpose, creating moments that matter for you and those you care about.",
                    analysis: [
                        "Using 'experience' language that resonates with female decision-makers",
                        "Emphasizing values-alignment which is important to female consumers",
                        "Highlighting authentic connection and relationships",
                        "Focusing on purpose and meaning rather than just features"
                    ]
                });
                
                // Option 2: Thoughtful Design
                options.push({
                    title: "Thoughtful Design",
                    statement: "Discover the difference thoughtful design makes—where every detail has been considered with your needs in mind, creating an experience that feels intuitively right from the very first moment.",
                    analysis: [
                        "Emphasizing thoughtfulness and attention to detail",
                        "Highlighting intuitive design that meets unstated needs",
                        "Focusing on the emotional response of 'feeling right'",
                        "Creating a sense of being truly understood"
                    ]
                });
                
                // Option 3: Meaningful Impact
                options.push({
                    title: "Meaningful Impact",
                    statement: "Make choices that matter—where your decisions create positive ripples for your life, community, and our shared world, all while enjoying an experience designed to exceed your expectations.",
                    analysis: [
                        "Highlighting the impact of choices beyond the individual",
                        "Connecting personal decisions to broader community benefits",
                        "Emphasizing sustainability and social responsibility",
                        "Balancing purpose with personal enjoyment and excellence"
                    ]
                });
                
                recommendation = "These positioning statements shift from feature-focused language to emotional and relational language that typically resonates with female decision-makers. Each option emphasizes different aspects—authentic connection, thoughtful design, and meaningful impact—that can be tested to determine which best resonates with your specific audience segment.";
                
            } else {
                // Option 1: Excellence Focus
                options.push({
                    title: "Excellence Focus",
                    statement: "Discover excellence in every detail—where innovation meets tradition, delivering exceptional quality and value that exceeds expectations every time.",
                    analysis: [
                        "Emphasis on quality and excellence which appeals to discerning consumers",
                        "Balancing innovation with tradition to establish credibility",
                        "Focus on value proposition with 'exceptional quality and value'",
                        "Setting clear expectations with 'exceeds expectations every time'"
                    ]
                });
                
                // Option 2: Strategic Advantage
                options.push({
                    title: "Strategic Advantage",
                    statement: "Gain the advantage with solutions designed for those who value efficiency and effectiveness—where cutting-edge approaches and proven expertise combine to deliver outstanding results.",
                    analysis: [
                        "Focusing on competitive advantage and results",
                        "Emphasizing efficiency and effectiveness",
                        "Highlighting the balance of innovation and expertise",
                        "Using decisive language that appeals to achievement-oriented audiences"
                    ]
                });
                
                // Option 3: Trusted Authority
                options.push({
                    title: "Trusted Authority",
                    statement: "Rely on New Zealand's most trusted provider—where decades of expertise, continuous innovation, and unwavering commitment to quality ensure confidence in every interaction.",
                    analysis: [
                        "Establishing authority and trustworthiness",
                        "Emphasizing longevity and proven reliability",
                        "Highlighting commitment to innovation and quality",
                        "Creating confidence through expertise and consistency"
                    ]
                });
                
                recommendation = "These positioning statements focus on different aspects that resonate with " + targetAudience + ". The first emphasizes excellence and quality, the second strategic advantage, and the third trust and authority. Each approach can be effective depending on your specific offering and the exact preferences of your audience segment.";
            }
        }
        
        // Display all three positioning options
        for (let i = 0; i < options.length; i++) {
            const option = options[i];
            const index = i + 1;
            
            document.getElementById('newPositioning' + index).textContent = option.statement;
            
            const analysisList = document.getElementById('analysisList' + index);
            analysisList.innerHTML = '';
            option.analysis.forEach(point => {
                const li = document.createElement('li');
                li.textContent = point;
                analysisList.appendChild(li);
            });
        }
        
        // Add option selector
        const resultBox = document.getElementById('resultBox');
        if (!document.getElementById('optionSelector')) {
            const optionSelector = document.createElement('div');
            optionSelector.id = 'optionSelector';
            optionSelector.className = 'option-selector';
            optionSelector.innerHTML = `
                <h3>Which positioning statement do you prefer?</h3>
                <button type="button" class="option-button" data-option="1">Option 1</button>
                <button type="button" class="option-button" data-option="2">Option 2</button>
                <button type="button" class="option-button" data-option="3">Option 3</button>
            `;
            
            // Insert before recommendation
            const recommendationTitle = resultBox.querySelector('.result-title:last-of-type');
            resultBox.insertBefore(optionSelector, recommendationTitle);
            
            // Add event listeners to buttons
            optionSelector.querySelectorAll('.option-button').forEach(button => {
                button.addEventListener('click', function() {
                    // Remove selected class from all buttons
                    optionSelector.querySelectorAll('.option-button').forEach(btn => {
                        btn.classList.remove('selected');
                    });
                    
                    // Add selected class to clicked button
                    this.classList.add('selected');
                    
                    // Highlight the selected option
                    document.querySelectorAll('.positioning-option').forEach((option, index) => {
                        if ((index + 1) == this.dataset.option) {
                            option.style.borderLeft = '4px solid #d32f2f';
                            option.style.backgroundColor = '#fafafa';
                        } else {
                            option.style.borderLeft = '4px solid #1a472a';
                            option.style.backgroundColor = '#f9f9f9';
                        }
                    });
                });
            });
        }
        
        document.getElementById('recommendation').textContent = recommendation;
        document.getElementById('resultBox').style.display = 'block';
        
        // Scroll to results
        document.getElementById('resultBox').scrollIntoView({ behavior: 'smooth' });
    }
});
