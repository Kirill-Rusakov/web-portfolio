<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Настройки получателя — ЗАМЕНИ НА СВОЙ EMAIL!
    $to = "rusacov91@mail.ru"; // <--- СЮДА ВСТАВЬ СВОЮ ПОЧТУ
    $subject = "Новая заявка с сайта-портфолио | Кирилл";

    // Собираем данные
    $name = htmlspecialchars(trim($_POST['name'] ?? ''));
    $email = htmlspecialchars(trim($_POST['email'] ?? ''));
    $phone = htmlspecialchars(trim($_POST['phone'] ?? ''));
    $message = htmlspecialchars(trim($_POST['message'] ?? ''));

    // Валидация
    if (empty($name) || empty($email) || empty($message)) {
        echo "Заполните обязательные поля (Имя, Email, Сообщение).";
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Введите корректный Email.";
        exit;
    }

    // Тело письма
    $body = "Поступила новая заявка с сайта-портфолио:\n\n";
    $body .= "Имя: $name\n";
    $body .= "Email: $email\n";
    $body .= "Телефон: $phone\n";
    $body .= "Сообщение:\n$message\n";
    $body .= "---\nОтправлено из Новосибирска";

    // Заголовки
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // Отправка
    if (mail($to, $subject, $body, $headers)) {
        echo "success"; // JS скрипт ждет 'успешно'
    } else {
        echo "Ошибка при отправке. Попробуйте позже или напишите в Telegram.";
    }
} else {
    echo "Доступ запрещен";
}
?>