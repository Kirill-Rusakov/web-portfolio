document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    const toggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    if(toggle) {
        toggle.addEventListener('click', () => {
            if(navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '70px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.backgroundColor = '#0a0c10';
                navLinks.style.padding = '30px';
                navLinks.style.gap = '20px';
                navLinks.style.backdropFilter = 'blur(20px)';
                navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
                navLinks.style.zIndex = '999';
            }
        });
    }

    // Плавный скролл
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if(navLinks.style.display === 'flex') navLinks.style.display = 'none';
            }
        });
    });

    // Модальное окно
    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');
    const closeModal = document.querySelector('.modal-close');
    
    function openProjectModal(card) {
        const name = card.dataset.name || 'Проект';
        const desc = card.dataset.desc || 'Описание проекта';
        const task = card.dataset.task || 'Постановка задачи';
        const tech = card.dataset.tech || 'Технологии';
        const result = card.dataset.result || 'Результат';
        const price = card.dataset.price || 'договорная';
        const icon = card.dataset.icon || '🚀';
        
        modalBody.innerHTML = `
            <div class="modal-icon">${icon}</div>
            <h3>${name}</h3>
            <p><strong>📖 Описание:</strong><br>${desc}</p>
            <p><strong>🎯 Задача:</strong><br>${task}</p>
            <div class="modal-tech"><strong>🛠 Технологии:</strong><br>${tech}</div>
            <p><strong>🏆 Результат:</strong><br>${result}</p>
            <div class="modal-price">💰 Стоимость проекта: ${price}</div>
            <a href="#contact" class="btn btn-primary" style="margin-top:20px; display:inline-block; width:100%; text-align:center;">📩 Заказать такой же проект</a>
        `;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    if(closeModal) {
        closeModal.onclick = () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        };
    }
    window.onclick = (e) => {
        if(e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };
    
    // Привязываем клики ко всем карточкам (включая будущие)
    function attachCardListeners() {
        document.querySelectorAll('.portfolio-card').forEach(card => {
            if(card.hasListener) return;
            card.addEventListener('click', function(e) {
                e.stopPropagation();
                openProjectModal(this);
            });
            card.style.cursor = 'pointer';
            card.hasListener = true;
        });
    }
    
    // Кнопка "Показать еще"
    const showBtn = document.getElementById('showMoreBtn');
    const hiddenProjects = document.querySelectorAll('.hidden-project');
    if(showBtn) {
        showBtn.addEventListener('click', () => {
            hiddenProjects.forEach(p => p.style.display = 'block');
            showBtn.style.display = 'none';
            attachCardListeners();
        });
    }
    
    // Анимация появления при скролле
    const animateItems = document.querySelectorAll('.portfolio-card, .service-item, .price-card, .process-step');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    animateItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
    
    attachCardListeners();
    
    // Отправка формы (AJAX)
    const form = document.getElementById('ajax-contact-form');
    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            const statusDiv = form.querySelector('.form-status');
            statusDiv.innerHTML = '<span style="color:#38bdf8;">⏳ Отправка...</span>';
            
            fetch('mail.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(data => {
                if(data.includes('success')) {
                    statusDiv.innerHTML = '<span style="color:#4ade80;">✅ Заявка отправлена! Я свяжусь с вами в ближайшее время.</span>';
                    form.reset();
                } else {
                    statusDiv.innerHTML = '<span style="color:#f87171;">❌ Ошибка: ' + data + '</span>';
                }
                setTimeout(() => { statusDiv.innerHTML = ''; }, 5000);
            })
            .catch(error => {
                statusDiv.innerHTML = '<span style="color:#f87171;">❌ Ошибка сети. Попробуйте позже или напишите в Telegram.</span>';
                console.error(error);
            });
        });
    }
});