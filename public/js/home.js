// Home page functionality
class HomePage {
    constructor() {
        this.questions = [];
        this.filteredQuestions = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadQuestions();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterQuestions(e.target.value);
            });
        }

        // Retry button
        const retryBtn = document.getElementById('retryBtn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                this.loadQuestions();
            });
        }
    }

    async loadQuestions() {
        this.showLoading();
        
        try {
            const response = await fetch('/api/questions');
            const data = await response.json();

            if (data.success) {
                this.questions = data.data;
                this.filteredQuestions = [...this.questions];
                this.renderQuestions();
            } else {
                this.showError();
            }
        } catch (error) {
            console.error('Error loading questions:', error);
            this.showError();
        }
    }

    filterQuestions(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        
        if (!term) {
            this.filteredQuestions = [...this.questions];
        } else {
            this.filteredQuestions = this.questions.filter(question => 
                question.title.toLowerCase().includes(term) ||
                question.desc.toLowerCase().includes(term)
            );
        }
        
        this.renderQuestions();
    }

    renderQuestions() {
        const grid = document.getElementById('questionsGrid');
        const loading = document.getElementById('loading');
        const errorState = document.getElementById('errorState');
        const emptyState = document.getElementById('emptyState');

        // Hide all states
        loading.classList.add('hidden');
        errorState.classList.add('hidden');
        emptyState.classList.add('hidden');
        grid.classList.add('hidden');

        if (this.filteredQuestions.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        }

        // Render questions
        grid.innerHTML = this.filteredQuestions.map(question => this.createQuestionCard(question)).join('');
        grid.classList.remove('hidden');

        // Initialize Lucide icons for the new content
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    createQuestionCard(question) {
        const truncatedDesc = question.desc.length > 150 
            ? question.desc.substring(0, 150) + '...' 
            : question.desc;

        return `
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in">
                <div class="p-6">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2">
                        ${this.escapeHtml(question.title)}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        ${this.escapeHtml(truncatedDesc)}
                    </p>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                            <i data-lucide="code-2" class="w-4 h-4"></i>
                            <span>3 Solutions</span>
                        </div>
                        <a href="/question/${question.id}" class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center">
                            View Details
                            <i data-lucide="arrow-right" class="w-4 h-4 ml-1"></i>
                        </a>
                    </div>
                </div>
                <div class="px-6 pb-4">
                    <div class="flex flex-wrap gap-2">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300">
                            <i data-lucide="globe" class="w-3 h-3 mr-1"></i>
                            Global
                        </span>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                            <i data-lucide="function-square" class="w-3 h-3 mr-1"></i>
                            Function
                        </span>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
                            <i data-lucide="settings" class="w-3 h-3 mr-1"></i>
                            Arguments
                        </span>
                    </div>
                </div>
            </div>
        `;
    }

    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
        document.getElementById('questionsGrid').classList.add('hidden');
        document.getElementById('errorState').classList.add('hidden');
        document.getElementById('emptyState').classList.add('hidden');
    }

    showError() {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('questionsGrid').classList.add('hidden');
        document.getElementById('errorState').classList.remove('hidden');
        document.getElementById('emptyState').classList.add('hidden');
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HomePage();
});