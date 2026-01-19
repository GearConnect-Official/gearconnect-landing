#!/usr/bin/env python3
"""
Script to replace inline styles with CSS classes in TSX files
"""
import re
import os
from pathlib import Path

# Mapping of inline styles to CSS classes
REPLACEMENTS = [
    (r"style=\{\{\s*color:\s*['\"]#1E232C['\"]\s*\}\}", 'className="text-primary"'),
    (r"style=\{\{\s*color:\s*['\"]#474C54['\"]\s*\}\}", 'className="text-secondary"'),
    (r"style=\{\{\s*color:\s*['\"]#6A707C['\"]\s*\}\}", 'className="text-tertiary"'),
    (r"style=\{\{\s*color:\s*['\"]#E53935['\"]\s*\}\}", 'className="text-brand"'),
    (r"style=\{\{\s*backgroundColor:\s*['\"]#E53935['\"]\s*\}\}", 'className="bg-brand"'),
    (r"style=\{\{\s*backgroundColor:\s*['\"]#C62828['\"]\s*\}\}", 'className="bg-brand-dark"'),
    (r"style=\{\{\s*backgroundColor:\s*['\"]#FFF5F5['\"]\s*\}\}", 'className="bg-light-red"'),
    (r"style=\{\{\s*backgroundColor:\s*['\"]#F7F8F9['\"]\s*\}\}", 'style={{ backgroundColor: "var(--grey-50)" }}'),
    (r"style=\{\{\s*borderColor:\s*['\"]#DAE0E6['\"]\s*\}\}", 'className="border-grey"'),
    (r"style=\{\{\s*borderColor:\s*['\"]#E53935['\"]\s*\}\}", 'className="border-brand"'),
    (r"style=\{\{\s*animationDelay:\s*['\"]1s['\"]\s*\}\}", 'className="animation-delay-1s"'),
    (r"style=\{\{\s*animationDelay:\s*['\"]1\.5s['\"]\s*\}\}", 'className="animation-delay-1-5s"'),
    (r"style=\{\{\s*animationDelay:\s*['\"]0\.2s['\"]\s*\}\}", 'className="animation-delay-0-2s"'),
    (r"style=\{\{\s*animationDelay:\s*['\"]0\.1s['\"]\s*\}\}", 'className="animation-delay-0-1s"'),
    (r"style=\{\{\s*animationDelay:\s*['\"]0\.3s['\"]\s*\}\}", 'className="animation-delay-0-3s"'),
    (r"style=\{\{\s*animationDelay:\s*['\"]0\.4s['\"]\s*\}\}", 'className="animation-delay-0-4s"'),
    (r"style=\{\{\s*animationFillMode:\s*['\"]both['\"]\s*\}\}", 'className="animation-fill-both"'),
    # Combined styles
    (r"style=\{\{\s*animationDelay:\s*['\"]0\.2s['\"]\s*,\s*animationFillMode:\s*['\"]both['\"]\s*\}\}", 'className="animation-delay-0-2s animation-fill-both"'),
    (r"style=\{\{\s*backgroundColor:\s*['\"]#FFF5F5['\"]\s*,\s*color:\s*['\"]#E53935['\"]\s*\}\}", 'className="bg-light-red text-brand"'),
]

def replace_in_file(file_path):
    """Replace inline styles in a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        for pattern, replacement in REPLACEMENTS:
            content = re.sub(pattern, replacement, content)
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ Updated: {file_path}")
            return True
        return False
    except Exception as e:
        print(f"✗ Error processing {file_path}: {e}")
        return False

def main():
    """Main function to process all TSX files"""
    src_dir = Path('src/app')
    
    if not src_dir.exists():
        print(f"Error: {src_dir} does not exist")
        return
    
    tsx_files = list(src_dir.rglob('*.tsx'))
    print(f"Found {len(tsx_files)} TSX files")
    
    updated_count = 0
    for tsx_file in tsx_files:
        if replace_in_file(tsx_file):
            updated_count += 1
    
    print(f"\n✓ Updated {updated_count} files")

if __name__ == '__main__':
    main()
