import sys

def patch_app_py():
    with open('backend/app.py', 'r') as f:
        content = f.read()

    update_state_logic = """
    if key and data is not None:
        try:
            if key == 'users':
                # Require admin token for any modifications to users!
                token = payload.get('token')
                if not token: 
                    print("Blocked unauthorized users update (No Token)")
                    return
                try:
                    token_data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
                    if token_data.get('role') != 'admin':
                        print("Blocked unauthorized users update (Not Admin)")
                        return
                except:
                    print("Blocked unauthorized users update (Invalid Token)")
                    return
                
                # Fetch existing users to merge passwords securely
                current_users = list(db['users'].find({}))
                db_users_map = {str(u.get('id')): u for u in current_users}
                
                for item in data:
                    item_id = str(item.get('id'))
                    # If incoming item has a plain text password, hash it!
                    if 'password' in item and item['password']:
                        item['password'] = generate_password_hash(item['password'])
                    else:
                        # Missing password in payload, preserve from DB
                        if item_id in db_users_map and 'password' in db_users_map[item_id]:
                            item['password'] = db_users_map[item_id]['password']
                            
                for item in data: item.pop('_id', None)
                db['users'].delete_many({})
                if len(data) > 0:
                    db['users'].insert_many(data)
                    
                # Broadcast updated users without passwords
                users_clean = list(db['users'].find({}, {'_id': 0}))
                for u in users_clean: u.pop('password', None)
                emit('state_updated', {'key': 'users', 'data': users_clean}, broadcast=True, include_self=False)
                return
                
            if key in ARRAY_KEYS:
"""
    
    # Replace the blocked logic we put earlier
    content = content.replace("""
    if key and data is not None:
        try:
            if key == 'users':
                print("WARNING: Client attempted to update 'users' via generic update_state. Blocked.")
                return
                
            if key in ARRAY_KEYS:
""", update_state_logic)

    with open('backend/app.py', 'w') as f:
        f.write(content)

patch_app_py()
print("app.py patched successfully again")
