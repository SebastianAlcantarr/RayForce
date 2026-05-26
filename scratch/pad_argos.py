from PIL import Image

img_path = r"c:\Users\lanfa\.gemini\antigravity\scratch\Rayforce\RayForce\public\images\marcas\15.jpg"

try:
    with Image.open(img_path) as img:
        original_width, original_height = img.size
        print(f"Original size: {original_width}x{original_height}")
        
        # We want to add horizontal padding and vertical padding to keep it 3:2
        # Let's pad by 120 pixels on left/right and 80 pixels on top/bottom
        pad_x = 120
        pad_y = 80
        
        new_width = original_width + (pad_x * 2)
        new_height = original_height + (pad_y * 2)
        
        # Create a new white canvas
        new_img = Image.new("RGB", (new_width, new_height), (255, 255, 255))
        
        # Paste original image in the center
        new_img.paste(img, (pad_x, pad_y))
        
        # Save back to the same path
        new_img.save(img_path, "JPEG", quality=95)
        print(f"Padded size: {new_img.size} saved successfully.")
except Exception as e:
    print(f"Error padding image: {e}")
