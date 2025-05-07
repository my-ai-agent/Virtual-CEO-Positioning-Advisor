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
    
    // Enable textarea for pasting content
    const websiteContent = document.getElementById('websiteContent');
    // Make sure the textarea is properly accepting input
    websiteContent.setAttribute('placeholder', 'Paste your website landing page content here...');
    
    // Form submission handling
    const form = document.getElementById('positioningForm');
    const resultContainer = document.getElementById('resultContainer');
    const positioningResult = document.getElementById('positioningResult');
    const loadingIndicator = document.getElementById('loadingIndicator');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get website content
            const content = websiteContent.value;
            
            if (!content) {
                alert('Please paste your website content');
                return;
            }
            
            // Show loading indicator
            resultContainer.classList.remove('hidden');
            if (loadingIndicator) {
                loadingIndicator.classList.remove('hidden');
            }
            positioningResult.innerHTML = '';
            
            // In a real implementation, this would call an API
            // For demo purposes, we'll simulate a response after a delay
            setTimeout(function() {
                const statement = generatePositioningStatement(content);
                if (loadingIndicator) {
                    loadingIndicator.classList.add('hidden');
                }
                positioningResult.innerHTML = statement;
            }, 2000);
        });
    }
    
    // Simulate positioning statement generation
    function generatePositioningStatement(content) {
        // This is a simplified version - in production you would call Claude's API
        
        // Extract key terms to personalize the response
        let businessType = "tourism experience";
        let culturalElement = "cultural traditions";
        
        if (content.toLowerCase().includes("tour")) {
            businessType = "guided journey";
        } else if (content.toLowerCase().includes("accommodation")) {
            businessType = "accommodation experience";
        }
        
        if (content.toLowerCase().includes("māori")) {
            culturalElement = "Māori wisdom";
        } else if (content.toLowerCase().includes("nature") || content.toLowerCase().includes("environment")) {
            culturalElement = "connection to nature";
        }
        
        // Template for positioning statement
        return `
            <p class="lead">"Walk alongside our Māori Kaitiaki (guardians) as they share ancient wisdom that reconnects you to the rhythms of land and spirit—a journey just for you."</p>
            
            <p>This positioning statement is designed to resonate deeply with female decision-makers by:</p>
            
            <ul>
                <li>Creating a personal invitation with "walk alongside" language</li>
                <li>Highlighting authentic cultural connection with "Māori Kaitiaki"</li>
                <li>Emphasizing personal transformation with "reconnects you"</li>
                <li>Addressing the desire for meaningful "me time" with "a journey just for you"</li>
            </ul>
            
            <p>This statement transforms your standard experience description into an emotional journey that speaks directly to women seeking meaningful travel experiences.</p>
            
            <p>Consider testing this positioning on your website and social media to measure engagement from female visitors.</p>
        `;
    }
});
