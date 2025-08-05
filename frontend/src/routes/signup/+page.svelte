<form id="form">
    <h1>Signup</h1>
    <div>
        <div id="nonSecure">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required>
            <br>
            <label for="firstName">First Name:</label>
            <input type="text" id="firstName" name="firstName" required>
            <br>
            <label for="lastName">Last Name:</label>
            <input type="text" id="lastName" name="lastName" required>
            <br>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
            <br>
        </div>
        <label for="password">Password</label>
        <input type="password" id="password" name="password" placeholder="Password" required>
        <br>
        <label for="cpassword">Confirm Password</label>
        <input type="password" id="cpassword" name="cpassword" placeholder="Confirm Password" required>

    </div>
    <button type="button" id="register" disabled>Register</button>
</form>