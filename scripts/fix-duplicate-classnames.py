#!/usr/bin/env python3
"""
Script to fix duplicate className attributes in TSX files
"""
import re
from pathlib import Path

def fix_duplicate_classnames(content):
    """Fix duplicate className attributes by merging them"""
    # Pattern to match duplicate className attributes
    pattern = r'className="([^"]+)"\s+className="([^"]+)"'
    
    def merge_classnames(match):
        class1 = match.group(1)
        class2 = match.group(2)
        # Merge and remove duplicates
        classes = list(dict.fromkeys((class1 + ' ' + class2).split()))
        return f'className="{" ".join(classes)}"'
    
    content = re.sub(pattern, merge_classnames, content)
    return content

def process_file(file_path):
    """Process a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        content = fix_duplicate_classnames(content)
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ Fixed: {file_path}")
            return True
        return False
    except Exception as e:
        print(f"✗ Error processing {file_path}: {e}")
        return False

def main():
    """Main function"""
    src_dir = Path('src/app')
    
    if not src_dir.exists():
        print(f"Error: {src_dir} does not exist")
        return
    
    tsx_files = list(src_dir.rglob('*.tsx'))
    print(f"Found {len(tsx_files)} TSX files")
    
    updated_count = 0
    for tsx_file in tsx_files:
        if process_file(tsx_file):
            updated_count += 1
    
    print(f"\n✓ Fixed {updated_count} files")

if __name__ == '__main__':
    main()
