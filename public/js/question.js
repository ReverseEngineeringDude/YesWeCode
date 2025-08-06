// Question detail page functionality
class QuestionPage {
    constructor() {
        this.questionId = this.getQuestionIdFromUrl();
        this.currentSolution = 'global';
        this.question = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadQuestion();
    }

    getQuestionIdFromUrl() {
        const path = window.location.pathname;
        const matches = path.match(/\/question\/(.+)$/);
        return matches ? matches[1] : null;
    }

    setupEventListeners() {
        // Solution tabs
        document.querySelectorAll('.solution-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const solution = e.currentTarget.dataset.solution;
                this.switchSolution(solution);
            });
        });

        // Copy buttons
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const solution = e.currentTarget.dataset.solution;
                this.copyCode(solution);
            });
        });
    }

    async loadQuestion() {
        if (!this.questionId) {
            this.showError();
            return;
        }

        this.showLoading();

        try {
            const response = await fetch(`/api/questions/${this.questionId}`);
            const data = await response.json();

            if (data.success) {
                this.question = data.data;
                this.renderQuestion();
            } else {
                this.showError();
            }
        } catch (error) {
            console.error('Error loading question:', error);
            this.showError();
        }
    }

    renderQuestion() {
        if (!this.question) return;

        // Update title and description
        document.getElementById('questionTitle').textContent = this.question.title;
        document.getElementById('questionDesc').textContent = this.question.desc;

        // Update page title
        document.title = `${this.question.title} - Questions Management`;

        // Populate code blocks
        document.getElementById('code-global').textContent = this.question.solutions.global;
        document.getElementById('code-function').textContent = this.question.solutions.function;
        document.getElementById('code-args').textContent = this.question.solutions.args;

        // Highlight code
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }

        // Show content
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('questionContent').classList.remove('hidden');

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    switchSolution(solutionType) {
        // Update tab states
        document.querySelectorAll('.solution-tab').forEach(tab => {
            if (tab.dataset.solution === solutionType) {
                tab.classList.add('border-primary-600', 'text-primary-600', 'bg-primary-50', 'dark:bg-primary-900/20');
                tab.classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'dark:text-gray-400', 'dark:hover:text-gray-200');
            } else {
                tab.classList.remove('border-primary-600', 'text-primary-600', 'bg-primary-50', 'dark:bg-primary-900/20');
                tab.classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'dark:text-gray-400', 'dark:hover:text-gray-200');
            }
        });

        // Update content visibility
        document.querySelectorAll('.solution-content').forEach(content => {
            if (content.id === `solution-${solutionType}`) {
                content.classList.remove('hidden');
            } else {
                content.classList.add('hidden');
            }
        });

        this.currentSolution = solutionType;
    }

    async copyCode(solutionType) {
        if (!this.question) return;

        const code = this.question.solutions[solutionType];
        
        try {
            await navigator.clipboard.writeText(code);
            this.showToast('Code copied to clipboard!', 'success');
        } catch (error) {
            console.error('Copy failed:', error);
            this.showToast('Failed to copy code', 'error');
        }
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('copyToast');
        if (!toast) return;

        // Update message
        const messageSpan = toast.querySelector('span') || toast;
        if (messageSpan !== toast) {
            messageSpan.textContent = message;
        }

        // Update styling based on type
        toast.className = `fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg transform transition-transform duration-300 ${
            type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`;

        // Show toast
        toast.classList.remove('translate-x-full');

        // Hide after 3 seconds
        setTimeout(() => {
            toast.classList.add('translate-x-full');
        }, 3000);
    }

    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
        document.getElementById('questionContent').classList.add('hidden');
        document.getElementById('errorState').classList.add('hidden');
    }

    showError() {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('questionContent').classList.add('hidden');
        document.getElementById('errorState').classList.remove('hidden');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuestionPage();
});